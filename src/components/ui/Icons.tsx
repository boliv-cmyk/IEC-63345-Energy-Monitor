
import React from 'react';
import { MeteringDeviceType } from '../../iec-types/enums';
import { Zap, Flame, Thermometer, Droplets, Power, Shield, Sliders, Info, Activity } from 'lucide-react';

export const getMeterIcon = (type: MeteringDeviceType, size: number = 18) => {
    switch (type) {
        case MeteringDeviceType.Electricity: return <Zap size={size} />;
        case MeteringDeviceType.Gas: return <Flame size={size} />;
        case MeteringDeviceType.Heat: return <Thermometer size={size} />;
        case MeteringDeviceType.Water: return <Droplets size={size} />;
        case MeteringDeviceType.Breaker: return <Power size={size} />;
        case MeteringDeviceType.Valve: return <Shield size={size} />;
        case MeteringDeviceType.HeatCostAllocator: return <Sliders size={size} />;
        case MeteringDeviceType.Other: return <Activity size={size} />;
        default: return <Info size={size} />;
    }
};
