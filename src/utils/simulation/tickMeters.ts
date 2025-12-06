
import { IEC_Meter } from '../../context/MDCContext';
import { updateTime } from './simulation-helpers';
import { tickElec } from './tickers/tickElec';
import { tickGas } from './tickers/tickGas';
import { tickWater } from './tickers/tickWater';
import { tickHeat } from './tickers/tickHeat';
import { tickHCA } from './tickers/tickHCA';
import { tickGeneric } from './tickers/tickGeneric';
import { tickBreaker } from './tickers/tickBreaker';
import { tickValve } from './tickers/tickValve';

export const tickMeters = (meters: IEC_Meter[]): IEC_Meter[] => {
    return meters.map(meter => {
        switch (meter.type) {
            case 'M_ELECM':
                return tickElec(meter);
            
            case 'M_GASM':
                return tickGas(meter);
            
            case 'M_WATERM':
                return tickWater(meter);

            case 'M_HEATM':
                return tickHeat(meter);

            case 'M_HCA':
                return tickHCA(meter);

            case 'M_GENERICM':
                return tickGeneric(meter);

            case 'M_BREAKERM':
                return tickBreaker(meter);

            case 'M_VALVEM':
                return tickValve(meter);

            default:
                // Fallback for unknown types
                // We cast to any because TypeScript correctly identifies that 'meter' is 'never' 
                // here due to exhaustive matching of the union type.
                const fallbackMeter = meter as any;
                return {
                    ...fallbackMeter,
                    CurrentDate: updateTime(fallbackMeter.CurrentDate)
                };
        }
    });
};
