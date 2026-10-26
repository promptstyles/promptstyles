# @promptstyles/taxonomy

The Prompt Styles taxonomy and rubric as data. Everything here is plain YAML, validated by the JSON Schemas in [`schemas/`](schemas/).

| File | What it is |
| --- | --- |
| [`taxonomy.yaml`](taxonomy.yaml) | Version, intro, map axes and the shared example scenario |
| [`styles/<id>.yaml`](styles/) | One prompt style per file |
| [`rubric.yaml`](rubric.yaml) | Levels (maturity with AI), the business ↔ tech focus axis, dimensions, interview script and preparation guide |
| [`score.mjs`](score.mjs) | Turns rubric scores into a level and a focus. No dependencies, runs in the browser too |
| [`schemas/`](schemas/) | JSON Schemas (draft-07) for the files above |
| [`CHANGELOG.md`](CHANGELOG.md) | What changed in each version |

Every text field has an `en` and a `pt` value.

## A style, field by field

| Field | Meaning |
| --- | --- |
| `id` | Slug, same as the file name |
| `order` | Display order |
| `status` | `draft` (open for discussion) or `stable` (reviewed) |
| `name`, `aka` | Name and other names people use |
| `summary`, `definition` | One line, then a short paragraph |
| `map.how` | 0 = describes the outcome, 100 = dictates the implementation |
| `map.verification` | 0 = trusts the output, 100 = verifies against a contract |
| `example.prompt` | A prompt for the shared scenario. `> ` marks the instruction, `#` and `//` mark context |
| `reveals` | What the style shows about the person using it |
| `use_when`, `watch_out` | When it fits, and the risks |
| `interview.look_for`, `interview.ask` | What an interviewer should observe and ask |
| `origin` | Who coined or popularized the term, when, and sources |
| `related` | Ids of related styles |

## Loading it in JavaScript

```js
import { loadTaxonomy } from '@promptstyles/taxonomy';

const { version, styles, rubric } = loadTaxonomy();
console.log(version, styles.map((s) => s.name.en));
```

Scoring an interview:

```js
import { loadRubric } from '@promptstyles/taxonomy';
import { scoreSession } from '@promptstyles/taxonomy/score';

const result = scoreSession(loadRubric(), {
  framing: 3, product: 4, style: 3, verification: 3, context: 2, ownership: 3,
});
console.log(`${result.level.name.en} · ${result.focus.name.en}`); // AI-Native · Business Builder
```

The published site also serves everything as JSON at `https://promptstyles.org/taxonomy.json`.

Licensed under [CC BY 4.0](../LICENSE-CONTENT.md).
