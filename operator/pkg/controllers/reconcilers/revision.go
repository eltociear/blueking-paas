/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云 - PaaS 平台 (BlueKing - PaaS System) available.
 * Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *	http://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * We undertake not to change the open source license (MIT license) applicable
 * to the current version of the project delivered to anyone in the future.
 */

package reconcilers

import (
	"context"

	"github.com/samber/lo"
	appsv1 "k8s.io/api/apps/v1"
	apimeta "k8s.io/apimachinery/pkg/api/meta"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
	logf "sigs.k8s.io/controller-runtime/pkg/log"

	"bk.tencent.com/paas-app-operator/api/v1alpha1"
	"bk.tencent.com/paas-app-operator/pkg/controllers/resources"
	"bk.tencent.com/paas-app-operator/pkg/utils/revision"
)

const defaultRevision int64 = 1

// RevisionReconciler 处理版本相关的调和逻辑
type RevisionReconciler struct {
	client.Client
	Result Result
}

// Reconcile ...
func (r *RevisionReconciler) Reconcile(ctx context.Context, bkapp *v1alpha1.BkApp) Result {
	log := logf.FromContext(ctx)
	var err error
	log.V(4).Info("handling revision reconciliation")

	// Generation 未变化说明 BkApp 的定义未被修改, 此时的调和循环不会触发新的 hooks
	if !isNewRevision(bkapp) {
		log.V(2).Info(
			"BkApp is unchanged, this reconciliation loop will never update bkapp revision",
			"ObservedGeneration",
			bkapp.Status.ObservedGeneration,
			"Generation",
			bkapp.Generation,
		)
		return r.Result
	}

	allDeploys := appsv1.DeploymentList{}
	err = r.List(
		ctx,
		&allDeploys,
		client.InNamespace(bkapp.Namespace),
		client.MatchingFields{v1alpha1.WorkloadOwnerKey: bkapp.Name},
	)
	if err != nil {
		return r.Result.withError(err)
	}

	maxOldRevision := revision.MaxRevision(lo.ToSlicePtr(allDeploys.Items))
	newRevision := maxOldRevision + 1

	if newRevision != defaultRevision {
		// 检测上一个版本的 PreReleaseHook 是否仍在运行
		preReleaseHook := resources.BuildPreReleaseHook(bkapp, bkapp.Status.FindHookStatus(v1alpha1.HookPreRelease))
		if preReleaseHook != nil && preReleaseHook.Status.Status == v1alpha1.HealthProgressing {
			if _, err = CheckAndUpdatePreReleaseHookStatus(ctx, r.Client, bkapp, resources.HookExecuteTimeoutThreshold); err != nil {
				return r.Result.withError(err)
			}
			return r.Result.withError(resources.ErrLastHookStillRunning)
		}
	}

	log.Info("new revision accepted!", "GetRevision", newRevision)
	bkapp.Status.Phase = v1alpha1.AppPending
	bkapp.Status.SetRevision(newRevision, bkapp.Annotations[v1alpha1.DeployIDAnnoKey])
	bkapp.Status.HookStatuses = nil
	bkapp.Status.ObservedGeneration = bkapp.Generation
	SetDefaultConditions(&bkapp.Status)
	err = r.Status().Update(ctx, bkapp)
	if err != nil {
		log.Error(err, "unable to update app revision")
		return r.Result.withError(err)
	}
	return r.Result
}

// SetDefaultConditions set all conditions to initial value
func SetDefaultConditions(status *v1alpha1.AppStatus) {
	availableMessage := "rolling upgrade"
	availableStatus := metav1.ConditionUnknown
	latestAvailableCond := apimeta.FindStatusCondition(status.Conditions, v1alpha1.AppAvailable)
	if latestAvailableCond == nil {
		availableMessage = "First time deployment, service unavailable"
		availableStatus = metav1.ConditionFalse
	}

	apimeta.SetStatusCondition(&status.Conditions, metav1.Condition{
		Type:               v1alpha1.AppAvailable,
		Status:             availableStatus,
		Reason:             "NewRevision",
		Message:            availableMessage,
		ObservedGeneration: status.ObservedGeneration,
	})
	apimeta.SetStatusCondition(&status.Conditions, metav1.Condition{
		Type:               v1alpha1.AppProgressing,
		Status:             metav1.ConditionTrue,
		Reason:             "NewRevision",
		ObservedGeneration: status.ObservedGeneration,
	})
	apimeta.SetStatusCondition(&status.Conditions, metav1.Condition{
		Type:               v1alpha1.AddOnsProvisioned,
		Status:             metav1.ConditionUnknown,
		Reason:             "Initial",
		ObservedGeneration: status.ObservedGeneration,
	})
	apimeta.SetStatusCondition(&status.Conditions, metav1.Condition{
		Type:               v1alpha1.HooksFinished,
		Status:             metav1.ConditionUnknown,
		Reason:             "Initial",
		ObservedGeneration: status.ObservedGeneration,
	})
}

func isNewRevision(bkapp *v1alpha1.BkApp) bool {
	// Generation 未变化说明 BkApp 的定义未被修改
	if bkapp.Status.ObservedGeneration < bkapp.Generation {
		return true
	}
	// DeployId 发生变化说明平台触发了部署
	return bkapp.Status.DeployId != bkapp.Annotations[v1alpha1.DeployIDAnnoKey]
}
