
import type { ShotProfile } from './types';

const STYLE_PROMPT_SUFFIX = "Maintain visual consistency with the original image, including all objects, lighting, and perspective realism. The output style should be optimized for forensic visualization: clean composition, muted colors, cinematic realism, and a subtle film grain.";

export const SHOT_PROFILES: ShotProfile[] = [
  {
    name: 'Wide Establishing Shot',
    lens: '24mm',
    description: 'An overall view of the space, capturing the entire scene.',
    prompt: `Generate a wide establishing shot of this space, as if taken with a 24mm lens, showing an overall view. ${STYLE_PROMPT_SUFFIX}`
  },
  {
    name: 'Mid Room Shot',
    lens: '35mm',
    description: 'A balanced view that captures the key spatial layout and furnishings.',
    prompt: `Generate a mid-room shot of this space, as if taken with a 35mm lens, to create a balanced view of the key spatial layout. ${STYLE_PROMPT_SUFFIX}`
  },
  {
    name: 'Desk/Surface Detail',
    lens: '50mm',
    description: 'A medium detail shot focusing on specific areas like desks or work surfaces.',
    prompt: `Generate a detail shot of a key surface or desk area in this space, as if taken with a 50mm lens. ${STYLE_PROMPT_SUFFIX}`
  },
  {
    name: 'Prop/Clue Close-up',
    lens: '85mm',
    description: 'A close framing of a relevant object or piece of evidence.',
    prompt: `Generate a close-up shot of a significant prop or clue within this space, as if taken with an 85mm lens. ${STYLE_PROMPT_SUFFIX}`
  },
  {
    name: 'Extreme Macro Shot',
    lens: '100mm',
    description: 'Fine details such as textures, traces, or small evidence.',
    prompt: `Generate an extreme macro shot focusing on a fine detail like a texture, trace, or small piece of evidence in this space, as if taken with a 100mm lens. ${STYLE_PROMPT_SUFFIX}`
  },
];
