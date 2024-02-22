export const addUniqueObj = <T>(arr: T[], obj: T, key: keyof T) => {
  if (!arr.some((item) => item[key] === obj[key])) {
    arr.push(obj);
  }
};
