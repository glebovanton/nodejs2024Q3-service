export const minPassLength = 3;

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function notFoundExceptionMessage(
  entity: { name: string } | string,
): string {
  return `${capitalizeFirstLetter(
    typeof entity === 'string' ? entity : entity.name,
  )} with this ID doesn't exist`;
}
