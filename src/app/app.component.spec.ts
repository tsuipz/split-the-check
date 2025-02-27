import { render, screen } from '@testing-library/angular';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
  it('should create the app', async () => {
    await render(AppComponent, {
      imports: [RouterOutlet],
    });

    const app = screen.getByRole('main');
    expect(app).toBeInTheDocument();
  });

  it('should have router outlet', async () => {
    const { container } = await render(AppComponent, {
      imports: [RouterOutlet],
    });

    expect(container.querySelector('router-outlet')).toBeInTheDocument();
  });
});
