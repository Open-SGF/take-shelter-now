import { composeConfigs, setProjectAnnotations } from 'storybook/preview-api';
// @ts-expect-error Storybook's runtime entry point does not export TypeScript declarations.
import * as sveltePreview from '@storybook/svelte/entry-preview';
import * as previewAnnotations from '../.storybook/preview';

setProjectAnnotations(composeConfigs([sveltePreview, previewAnnotations]));
