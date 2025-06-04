import { InputSwitch } from 'primereact/inputswitch';
import { settings } from '../states/settings';

export const MuteSwitch = () => {
    const isMuted = settings((state) => state.isMuted)
    const toggleIsMuted = settings((state) => state.toggleIsMuted)

    return (
        <div className="flex align-items-center gap-2">
            <InputSwitch checked={isMuted} onChange={() => toggleIsMuted()} />
            <span className="font-bold text-bluegray-50">mute</span>
        </div>
    )
}