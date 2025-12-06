
import { generateElecMeter } from './genElec';
import { generateHeatMeter } from './genHeat';
import { generateGasMeter } from './genGas';
import { generateWaterMeter } from './genWater';
import { generateHCAMeter } from './genHCA';
import { generateGenericMeter } from './genGeneric';
import { generateBreaker, generateValve } from './genActuators';

export const generateMockIECSystem = () => {
    return [
        generateElecMeter(),
        generateHeatMeter(),
        generateGasMeter(),
        generateWaterMeter(),
        generateHCAMeter(),
        generateGenericMeter(),
        generateBreaker(),
        generateValve()
    ];
};
