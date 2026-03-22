function toTitleCase(value: string) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function formatOrganizationName(value: string | null | undefined) {
  if (!value) {
    return 'Your organization'
  }

  return toTitleCase(
    value
      .replace(/^tenant[-_]?/i, '')
      .replace(/^org[-_]?/i, '')
      .trim()
  )
}

export function formatRoleName(value: string) {
  return toTitleCase(value.replace(/([a-z])([A-Z])/g, '$1 $2'))
}

export function formatPermissionName(value: string) {
  return toTitleCase(value.replace(/^Can/, '').replace(/([a-z])([A-Z])/g, '$1 $2'))
}

export function toRouteLabel(segment: string) {
  return toTitleCase(segment)
}
