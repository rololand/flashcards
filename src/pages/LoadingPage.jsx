function LoadingPage() {

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <div className="flex flex-column">
        <i className="pi pi-spin pi-spinner" style={{'fontSize': '2em'}}></i>
      </div>
    </div>

  );
}

export default LoadingPage;
