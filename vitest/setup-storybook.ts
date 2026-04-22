import { composeConfigs, setProjectAnnotations } from 'storybook/preview-api';
import * as sveltePreview from '@storybook/svelte/entry-preview';
import * as previewAnnotations from '../.storybook/preview';

setProjectAnnotations(composeConfigs([sveltePreview, previewAnnotations]));
