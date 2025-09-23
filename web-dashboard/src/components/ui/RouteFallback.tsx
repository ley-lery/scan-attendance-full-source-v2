import LoadingUi from "../hero-ui/loading/Loading";

const RouteFallback = () => {
  return (
    <div className="h-screen flex flex-col gap-2 items-center justify-center bg-white dark:bg-zinc-900">
      <LoadingUi/>
    </div>
  );
};
export default RouteFallback;
