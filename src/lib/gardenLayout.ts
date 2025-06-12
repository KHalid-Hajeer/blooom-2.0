export interface PlotPosition {
    id: number; // Unique ID for the plot, starting from 1
    x: number; // Position in pixels from the center
    y: number; // Position in pixels from the center
}

/**
 * Generates a stable, isometric grid layout for the garden.
 * The layout consists of 17 plots:
 * - 1 central plot
 * - 8 plots in a surrounding ring
 * - 2 plots extending from the N, E, S, W positions of the ring
 * @returns An array of 17 plot positions.
 */
export const generateIsometricGardenLayout = (): PlotPosition[] => {
    const plots: PlotPosition[] = [];
    const ringRadius = 110;
    const spokeOffset = 70;

    // --- All positions are hardcoded for a consistent isometric layout ---

    // ID 1: Center Plot
    plots.push({ id: 1, x: 0, y: 0 });

    // ID 2-9: The main ring of 8 plots
    // Using sine/cosine but with adjustments for an isometric feel (y-coordinates are scaled)
    const isometricScale = 0.6;
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i - Math.PI / 2; // Start from the top
        plots.push({
            id: i + 2,
            x: Math.round(ringRadius * Math.cos(angle)),
            y: Math.round(ringRadius * Math.sin(angle) * isometricScale),
        });
    }

    // ID 10-17: The outer "spoke" plots
    const ringPlotNorth = plots.find(p => p.id === 2)!; // Top-most plot
    const ringPlotEast = plots.find(p => p.id === 4)!;  // Right-most plot
    const ringPlotSouth = plots.find(p => p.id === 6)!; // Bottom-most plot
    const ringPlotWest = plots.find(p => p.id === 8)!;  // Left-most plot

    // Spokes from North (12 o'clock)
    plots.push({ id: 10, x: ringPlotNorth.x, y: ringPlotNorth.y - spokeOffset * isometricScale });
    plots.push({ id: 11, x: ringPlotNorth.x, y: ringPlotNorth.y - (spokeOffset * 2) * isometricScale });

    // Spokes from East (3 o'clock)
    plots.push({ id: 12, x: ringPlotEast.x + spokeOffset, y: ringPlotEast.y });
    plots.push({ id: 13, x: ringPlotEast.x + (spokeOffset * 2), y: ringPlotEast.y });

    // Spokes from South (6 o'clock)
    plots.push({ id: 14, x: ringPlotSouth.x, y: ringPlotSouth.y + spokeOffset * isometricScale });
    plots.push({ id: 15, x: ringPlotSouth.x, y: ringPlotSouth.y + (spokeOffset * 2) * isometricScale });
    
    // Spokes from West (9 o'clock)
    plots.push({ id: 16, x: ringPlotWest.x - spokeOffset, y: ringPlotWest.y });
    plots.push({ id: 17, x: ringPlotWest.x - (spokeOffset * 2), y: ringPlotWest.y });
    
    return plots;
};

export const TOTAL_GARDEN_PLOTS = 17;