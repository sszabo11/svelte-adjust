import { page } from '$app/stores';

export function inject({
  is_group,
  group,
  ad_name,
  category,
  region,
  fill,
  rect,
  site_id,
  tags,
  ratio,
  context
}: {
  is_group: boolean;
  group: string;
  ad_name: string;
  category: string;
  region: string;
  fill: string;
  rect: { width: number; height: number };
  tags: string[];
  site_id: number;
  ratio: number;
  context: string;
}) {
  let body = {
    ad_unit_name: ad_name,
    ad_unit_group: is_group && group ? group : null,
    dynamic: '',
    in_viewport: true,
    key: '',
    ad_unit_type: is_group && group ? 'group' : 'page',
    site_id: Number(site_id),
    endpoint: $page.url.pathname,
    tags: tags ?? ['gym', 'equipment', 'fitness'],
    category: category ?? 'Educational Toys',
    region: region ?? 'JP',
    context,
    language: 'fr',
    gender: 'any',
    ratio,
    fill: fill ?? '',
    width: rect.width,
    height: rect.height
  };
  console.log(ratio);

  if (!priority) {
    priority = in_viewport ? 3 : 0;
  }
  if (!in_viewport) return;
  let {
    error: err,
    html,
    response,
    new: dimensions,
    ad_id: adId,
    size_id: size
  } = await display(ratio, body, { width, height }, borderRadius || 0, priority);

  console.log(response, err);
  ad_dimensions = dimensions;

  if (err && err.includes('duplicate key value violates unique constraint "uq_ad_unit"')) {
    error = `Ad units do not have unique names: ${name}`;
    return;
  }

  console.log('element adunitid', container_element.dataset.adUnitId);
  //let prev_units = JSON.parse(localStorage.getItem('ad_units') ?? '{}');
  //localStorage.setItem('ad_units', JSON.stringify({ ...prev_units, [ad_unit_id]: name }));
  //console.log(prev_units);

  size_id = size;
  ad_id = adId;

  if (err) {
    console.log('erro', err);
    error = err;
  } else if (html) {
    ad = html;

    ad_unit_id = response.ad_unit_id;
    ad.href = dev ? '' : !error ? `${server_click}?id=${size_id}_${ad_id}_${ad_unit_id}` : '';

    element.appendChild(html);
  }
  console.log(ad_unit_id);

  let images = [...ad.querySelectorAll('img')];

  //for (let i = 0; i < images.length; i++){
  //  images[images.item(i).onlo]
  //}
  await Promise.all(images.map((im) => new Promise((resolve) => (im.onload = resolve)))).then(
    () => {
      console.log('The images have loaded at last!\nHere are their dimensions (width,height):');
      console.log(images.map((im) => [im.width, im.height]));
    }
  );
}
