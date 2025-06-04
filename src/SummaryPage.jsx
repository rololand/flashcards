import { Button } from "primereact/button";
import { userState } from './states/user';

function SummaryPage(props) {
  const userName = userState((state) => state.userName)

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <div className="flex flex-column">
        <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
          <p className="m-0 text-primary" >Excellent {userName}!</p>
        </div>
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          <p className="m-0 text-color-secondary" >You have finished exercise!</p>
        </div>
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          <Button label="Back" onClick={props.handleSummaryBackClick} />
        </div>
      </div>
    </div>

  );
}

export default SummaryPage;
