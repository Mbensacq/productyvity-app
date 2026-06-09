import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette } from './CommandPalette';

const notes = [
  { id: '1', title: 'Gardening' },
  { id: '2', title: 'Cooking' },
];

function setup(overrides: Partial<Parameters<typeof CommandPalette>[0]> = {}) {
  const props = {
    open: true,
    onClose: vi.fn(),
    notes,
    onSelectNote: vi.fn(),
    onCreateNote: vi.fn(),
    onOpenDaily: vi.fn(),
    ...overrides,
  };
  render(<CommandPalette {...props} />);
  return props;
}

describe('CommandPalette', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <CommandPalette
        open={false}
        onClose={vi.fn()}
        notes={notes}
        onSelectNote={vi.fn()}
        onCreateNote={vi.fn()}
        onOpenDaily={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows actions and notes when open', () => {
    setup();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nouvelle note/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /note du jour/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gardening' })).toBeInTheDocument();
  });

  it('filters notes by query', async () => {
    setup();
    await userEvent.type(screen.getByRole('textbox'), 'cook');
    expect(screen.queryByRole('button', { name: 'Gardening' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cooking' })).toBeInTheDocument();
  });

  it('selects a note and closes on click', async () => {
    const props = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Cooking' }));
    expect(props.onSelectNote).toHaveBeenCalledWith('2');
    expect(props.onClose).toHaveBeenCalled();
  });

  it('triggers create and daily actions', async () => {
    const props = setup();
    await userEvent.click(screen.getByRole('button', { name: /nouvelle note/i }));
    expect(props.onCreateNote).toHaveBeenCalled();
  });
});
