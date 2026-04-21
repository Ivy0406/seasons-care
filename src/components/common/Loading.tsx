import Spinner from '@/components/ui/spinner';

function Loading() {
  return (
    <div className="text-primary-dark flex items-center gap-2">
      <Spinner />
      <span className="font-label-md text-primary-dark">載入中...</span>
    </div>
  );
}

export default Loading;
