import { Button } from "primereact/button";
import { userState } from './states/user';
import { settings } from "./states/settings.js";

import uitxt from './uitxt.json'

function SummaryPage(props) {
  const userName = userState((state) => state.userName)
  const uiLang = settings((state) => state.uiLang)

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <div className="flex flex-column">
        <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
          <p className="m-0 text-primary" >{uitxt["11"][uiLang]} {userName}!</p>
        </div>
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          <p className="m-0 text-color-secondary" >{uitxt["12"][uiLang]}</p>
        </div>
        <div className="flex align-items-center justify-content-center h-4rem border-round m-2">
          <Button label={uitxt["13"][uiLang]} onClick={props.handleSummaryBackClick} />
        </div>
      </div>
    </div>

  );
}

export default SummaryPage;
