import type { Dispatch } from 'react';
import type { Action, State } from './state';

export type ScreenProps = { s: State; dispatch: Dispatch<Action> };
