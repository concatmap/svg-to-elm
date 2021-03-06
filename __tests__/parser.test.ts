import * as path from 'path';
import * as fs from 'fs';
import Svg from '../src/svg';

import Parser, { ParserResult } from '../src/parser';
import { ElmModule } from '../src/types';

describe('Parser', () => {
  it('can parse an svg', async () => {
    const fixture = path.resolve(__dirname, 'fixtures', 'search.svg');
    const output: ParserResult = await new Parser().parse(fixture, {
      moduleName: 'SearchIcon',
    });

    expect(output.success).toEqual(true);
    expect((output as ElmModule).moduleName).toEqual('SearchIcon');
    expect((output as ElmModule).viewBody).toMatchInlineSnapshot(`
"view: Html msg
view =
  svg [width \\"24\\", height \\"24\\", viewBox \\"0 0 24 24\\"] [         Svg.path [d \\"M19.85352,19.14648l-4.42285-4.42285C16.40637,13.58636,17,12.11237,17,10.5C17,6.91602,14.08398,4,10.5,4 S4,6.91602,4,10.5S6.91602,17,10.5,17c1.61237,0,3.08636-0.59363,4.22363-1.56934l4.42285,4.42285 C19.24414,19.95117,19.37207,20,19.5,20s0.25586-0.04883,0.35352-0.14648C20.04883,19.6582,20.04883,19.3418,19.85352,19.14648z M5,10.5C5,7.46729,7.46729,5,10.5,5S16,7.46729,16,10.5S13.53271,16,10.5,16S5,13.53271,5,10.5z\\"] []         ]

viewWithAttributes: List (Html.Attribute msg) -> Html msg
viewWithAttributes attributes =
  svg ([width \\"24\\", height \\"24\\", viewBox \\"0 0 24 24\\"] ++ attributes) [         Svg.path [d \\"M19.85352,19.14648l-4.42285-4.42285C16.40637,13.58636,17,12.11237,17,10.5C17,6.91602,14.08398,4,10.5,4 S4,6.91602,4,10.5S6.91602,17,10.5,17c1.61237,0,3.08636-0.59363,4.22363-1.56934l4.42285,4.42285 C19.24414,19.95117,19.37207,20,19.5,20s0.25586-0.04883,0.35352-0.14648C20.04883,19.6582,20.04883,19.3418,19.85352,19.14648z M5,10.5C5,7.46729,7.46729,5,10.5,5S16,7.46729,16,10.5S13.53271,16,10.5,16S5,13.53271,5,10.5z\\"] []         ]"
`);
  });

  it('can parse svg contents into a class', async () => {
    const fixture = path.resolve(__dirname, 'fixtures', 'search.svg');
    const output: Svg = await new Parser().parseSvg(
      fs.readFileSync(fixture, { encoding: 'utf8' }),
    );

    expect(output.attributes).toEqual([
      { name: 'width', value: '24' },
      { name: 'height', value: '24' },
      { name: 'viewBox', value: '0 0 24 24' },
    ]);

    expect(output.children).toEqual([
      {
        element: 'path',
        attributes: [
          {
            name: 'd',
            value:
              'M19.85352,19.14648l-4.42285-4.42285C16.40637,13.58636,17,12.11237,17,10.5C17,6.91602,14.08398,4,10.5,4 S4,6.91602,4,10.5S6.91602,17,10.5,17c1.61237,0,3.08636-0.59363,4.22363-1.56934l4.42285,4.42285 C19.24414,19.95117,19.37207,20,19.5,20s0.25586-0.04883,0.35352-0.14648C20.04883,19.6582,20.04883,19.3418,19.85352,19.14648z M5,10.5C5,7.46729,7.46729,5,10.5,5S16,7.46729,16,10.5S13.53271,16,10.5,16S5,13.53271,5,10.5z',
          },
        ],
        children: [],
      },
    ]);
  });

  it('can parse svg contents with sibling children', async () => {
    const fixture = path.resolve(__dirname, 'fixtures', 'clothing-button.svg');
    const output: Svg = await new Parser().parseSvg(
      fs.readFileSync(fixture, { encoding: 'utf8' }),
    );

    expect(output.children).toEqual([
      {
        element: 'path',
        attributes: [
          {
            name: 'fillRule',
            value: 'nonzero',
          },
          {
            name: 'd',
            value: 'M22 23.414L23.414 22 36.87 35.456l-1.414 1.414z',
          },
        ],
        children: [],
      },
      {
        element: 'path',
        attributes: [
          {
            name: 'fillRule',
            value: 'nonzero',
          },
          {
            name: 'd',
            value: 'M36.87 23.414L35.456 22 22 35.456l1.414 1.414z',
          },
        ],
        children: [],
      },
    ]);
  });

  it('can parse svg children', async () => {
    const fixture = path.resolve(
      __dirname,
      'fixtures',
      'search-with-children.svg',
    );

    const output: Svg = await new Parser().parseSvg(
      fs.readFileSync(fixture, { encoding: 'utf8' }),
    );

    expect(output.children).toEqual([
      {
        element: 'path',
        attributes: [
          {
            name: 'd',
            value: expect.any(String),
          },
        ],
        children: [
          {
            element: 'path',
            attributes: [{ name: 'd', value: 'bar' }],
            children: [],
          },
        ],
      },
    ]);
  });
});
