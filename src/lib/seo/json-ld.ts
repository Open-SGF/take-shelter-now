import { formatShelterAddress } from '$lib/shelters/presentation';
import type { Shelter } from '$lib/shelters/types';
import type { Graph, Organization, Place, Thing, WebSite, WithContext } from 'schema-dts';
import { DEFAULT_DESCRIPTION, OPENSGF_URL, SITE_TITLE } from './constants';
import { siteUrl } from './url';

export type JsonLdValue = Graph | WithContext<Thing> | WithContext<Thing>[];

export function serializeJsonLd(value: JsonLdValue): string {
	return JSON.stringify(value)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/'/g, '\\u0027');
}

export function jsonLdScript(value: JsonLdValue): string {
	return `<script type="application/ld+json">${serializeJsonLd(value)}</script>`;
}

export function siteJsonLd(): JsonLdValue {
	const organization = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': `${OPENSGF_URL}#organization`,
		name: 'OpenSGF',
		url: OPENSGF_URL,
	} satisfies WithContext<Organization>;

	const website = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${siteUrl('/')}#website`,
		name: SITE_TITLE,
		url: siteUrl('/'),
		description: DEFAULT_DESCRIPTION,
		publisher: {
			'@id': `${OPENSGF_URL}#organization`,
		},
	} satisfies WithContext<WebSite>;

	return [organization, website];
}

export function shelterPlaceJsonLd(shelter: Shelter): WithContext<Place> {
	const pageUrl = siteUrl(`/shelters/${shelter.slug}/`);
	const description = `${shelter.name} shelter at ${formatShelterAddress(shelter)}.`;

	return {
		'@context': 'https://schema.org',
		'@type': 'Place',
		name: shelter.name,
		url: pageUrl,
		description,
		address: {
			'@type': 'PostalAddress',
			streetAddress: [shelter.addressLine1, shelter.addressLine2].filter(Boolean).join(', '),
			addressLocality: shelter.city,
			addressRegion: shelter.state,
			postalCode: shelter.zip,
			addressCountry: 'US',
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: shelter.latitude,
			longitude: shelter.longitude,
		},
		image: siteUrl(`/shelters/${shelter.slug}/og.png`),
	};
}
