import { Button } from "primereact/button";

function SummaryPage(props) {

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <div className="flex flex-column">
        <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
          <p className="m-0 text-primary" >Excellent {props.userName}!</p>
        </div>
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          <p className="m-0 text-color-secondary" >You have finished exercise!</p>
        </div>
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          <Button label="Back" onClick={() => {window.location.reload()}} />
        </div>
      </div>
    </div>

  );
}

export default SummaryPage;
