/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { useState } from 'react';
import { useIsDark } from '../util/services.js';
import ErrorBoundary from '../sidebar-tsx/ErrorBoundary.js';

type ActiveView = 'editor' | 'team';

const HeaderTabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => {
	return (
		<button
			onClick={onClick}
			className={`
				px-3 py-1 text-xs font-medium rounded transition-all duration-200
				${active
					? 'bg-[#0e70c0] text-white'
					: 'text-void-fg-2 hover:bg-void-bg-1 hover:text-void-fg-1'
				}
			`}
		>
			{children}
		</button>
	);
};

const TeamView = () => {
	return (
		<div className="flex items-center justify-center h-full w-full">
			<div className="text-4xl font-light text-void-fg-1">Hello World</div>
		</div>
	);
};

export const RoveTopPanel = () => {
	const isDark = useIsDark();
	const [activeView, setActiveView] = useState<ActiveView>('editor');

	return (
		<div className={`@@void-scope ${isDark ? 'dark' : ''}`}>
			{/* Buttons positioned on the left side, next to traffic lights */}
			<div
				className="fixed top-0 z-[999999] flex items-center gap-1"
				style={{
					left: '80px', // After traffic light buttons
					height: '35px',
					paddingTop: '4px'
				}}
			>
				<HeaderTabButton
					active={activeView === 'team'}
					onClick={() => setActiveView('team')}
				>
					Team
				</HeaderTabButton>
				<HeaderTabButton
					active={activeView === 'editor'}
					onClick={() => setActiveView('editor')}
				>
					Editor
				</HeaderTabButton>
			</div>

			{/* Team view overlay - only shown when Team is active */}
			{activeView === 'team' && (
				<div
					className="fixed left-0 right-0 bottom-0 z-[99997] bg-void-bg-3"
					style={{ top: '35px' }}
				>
					<ErrorBoundary>
						<TeamView />
					</ErrorBoundary>
				</div>
			)}
		</div>
	);
};

