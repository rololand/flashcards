import { useEffect } from 'react';
import { useEventListener } from 'primereact/hooks';
import { Button } from "primereact/button";
import { userState } from '../states/user';
import { settings } from "../states/settings.js";

import uitxt from '../uitxt.json'

function SettingsPage(props) {
  const userName = userState((state) => state.userName)
  const uiLang = settings((state) => state.uiLang)

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <div className="flex flex-column">
        SettingsPage
      </div>
    </div>

  );
}

export default SettingsPage;
