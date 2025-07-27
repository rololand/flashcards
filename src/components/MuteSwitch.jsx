import { InputSwitch } from 'primereact/inputswitch';
import { settings } from '../states/settings';
import uitxt from '../uitxt.json'

export const MuteSwitch = () => {
    const isMuted = settings((state) => state.isMuted)
    const toggleIsMuted = settings((state) => state.toggleIsMuted)
    const uiLang = settings((state) => state.uiLang)

    return (
        <div className="flex align-items-center gap-2">
            <InputSwitch checked={isMuted} onChange={() => toggleIsMuted()} />
            <span className="font-bold text-bluegray-50">{uitxt["17"][uiLang]}</span>
        </div>
    )
}