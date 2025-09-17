import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import MarkersTable from './MarkersTable';

describe('MarkersTable.ts', () => {
  const removeFnMock = vi.fn();
  const moveMarkerFnMock = vi.fn();

  it('Renders properly', () => {
    const fakeCoords: ICoordinate[] = [
      { lat: 1.23, lng: 2.32 },
      { lat: 6.23, lng: 4.32 },
      { lat: 3.23, lng: 7.32 },
    ];

    render(
      <MarkersTable
        markers={fakeCoords}
        removeMarker={removeFnMock}
        moveMarker={moveMarkerFnMock}
      />
    );

    expect(screen.getByText('Lat: 1.23')).toHaveTextContent('Lat: 1.23');
    expect(screen.getByText('Lat: 6.23')).toHaveTextContent('Lat: 6.23');
    expect(screen.getByText('Lat: 3.23')).toHaveTextContent('Lat: 3.23');
    expect(screen.getByText('Lng: 2.32')).toHaveTextContent('Lng: 2.32');
    expect(screen.getByText('Lng: 4.32')).toHaveTextContent('Lng: 4.32');
    expect(screen.getByText('Lng: 7.32')).toHaveTextContent('Lng: 7.32');
  });
});
