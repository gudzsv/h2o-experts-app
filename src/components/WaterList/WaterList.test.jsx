import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import { createTestStore } from '../../test/store.js';
import WaterList from './WaterList.jsx';

// The scroller watches its items with IntersectionObserver, which jsdom lacks.
vi.stubGlobal(
  'IntersectionObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
);

const renderList = waterData =>
  render(
    <Provider store={createTestStore({ units: 'ml' })}>
      <WaterList
        waterData={waterData}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        dateForCalendar={new Date()}
      />
    </Provider>
  );

const scroller = () =>
  document.querySelector('.react-horizontal-scrolling-menu--scroll-container');

describe('WaterList', () => {
  it('shows the empty message outside the horizontal scroller', () => {
    renderList([]);

    expect(screen.getByText('No water was consumed on this day.')).toBeTruthy();
    expect(scroller()).toBeNull();
  });

  it('puts entries in the horizontal scroller', () => {
    renderList([
      { _id: 'a', usedWater: 250, drinkingTime: '2026-10-27T09:00:00' },
    ]);

    expect(scroller()).not.toBeNull();
    expect(screen.queryByText('No water was consumed on this day.')).toBeNull();
  });
});
