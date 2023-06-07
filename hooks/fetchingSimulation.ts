export const fetchingSimulation = () => {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });
};
