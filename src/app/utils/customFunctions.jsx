export function getDataByParentId(data, path) {
  return data?.filter((item) => item.path === path);
}
