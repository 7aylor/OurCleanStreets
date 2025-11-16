import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import MarkersTable from './MarkersTable';
import type { ICoordinate } from '@ocs/types';

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

    expect(screen.getByText('1.23')).toHaveTextContent('1.23');
    expect(screen.getByText('6.23')).toHaveTextContent('6.23');
    expect(screen.getByText('3.23')).toHaveTextContent('3.23');
    expect(screen.getByText('2.32')).toHaveTextContent('2.32');
    expect(screen.getByText('4.32')).toHaveTextContent('4.32');
    expect(screen.getByText('7.32')).toHaveTextContent('7.32');
  });
});
