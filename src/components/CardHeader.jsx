import { Toolbar } from 'primereact/toolbar';

import { MuteSwitch } from './MuteSwitch.jsx';

function CardHeader() {

  return (
    <Toolbar start={MuteSwitch} className="bg-gray-900 shadow-2" />
  );
}

export default CardHeader;