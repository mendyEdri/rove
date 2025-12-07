/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { mountRoveTopPanel } from './react/out/rove-top-panel/index.js';
import { h, getActiveWindow } from '../../../../base/browser/dom.js';

// Rove Top Panel contribution that mounts the component at startup
export class RoveTopPanelContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.roveTopPanel';

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this.initialize();
	}

	private initialize(): void {
		console.log('[RoveTopPanel] Initializing...');
		// Get the active window reference for multi-window support
		const targetWindow = getActiveWindow();

		// Find the monaco-workbench element using the proper window reference
		const workbench = targetWindow.document.querySelector('.monaco-workbench');
		console.log('[RoveTopPanel] Workbench found:', !!workbench);

		if (workbench) {
			const topPanelContainer = h('div.rove-top-panel-container').root;
			workbench.appendChild(topPanelContainer);
			console.log('[RoveTopPanel] Container appended to workbench');
			this.instantiationService.invokeFunction((accessor: ServicesAccessor) => {
				console.log('[RoveTopPanel] Mounting React component...');
				const result = mountRoveTopPanel(topPanelContainer, accessor);
				console.log('[RoveTopPanel] Mount result:', result);
				if (result && typeof result.dispose === 'function') {
					this._register(toDisposable(result.dispose));
				}
			});
			// Register cleanup for the DOM element
			this._register(toDisposable(() => {
				if (topPanelContainer.parentElement) {
					topPanelContainer.parentElement.removeChild(topPanelContainer);
				}
			}));
		}
	}
}

// Register the contribution to be initialized during the AfterRestored phase
registerWorkbenchContribution2(RoveTopPanelContribution.ID, RoveTopPanelContribution, WorkbenchPhase.AfterRestored);

