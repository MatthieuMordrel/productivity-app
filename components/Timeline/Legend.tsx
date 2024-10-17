const Legend = () => {
  return (
    <div className="mt-6 flex justify-start space-x-4">
      <div className="flex items-center">
        <div className="mr-2 h-3 w-3 rounded-full bg-primary" />
        <span className="text-sm">Work</span>
      </div>
      <div className="flex items-center">
        <div className="mr-2 h-3 w-3 rounded-full bg-secondary" />
        <span className="text-sm">Pause</span>
      </div>
      <div className="flex items-center">
        <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
        <span className="text-sm">Off-time</span>
      </div>
    </div>
  );
};

export default Legend;
