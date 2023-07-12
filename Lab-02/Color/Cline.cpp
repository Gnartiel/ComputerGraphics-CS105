#include "pch.h"
#include "Cline.h"
void CLine::DDA_01(CDC* pDC, double x1, double y1, double x2, double y2, COLORREF color)
{
	double xn, yn, dx, dy;
	dx = x2 - x1;
	dy = y2 - y1;
	if (dx == 0)
	{
		double ystart = min(y1, y2);
		double yend = max(y1, y2);
		for (double y = ystart; y <= yend; y++)
		{
			pDC->SetPixel(round(x1), round(y), color);
		}
		return;
	}

	double m = (double)dy / dx;
	xn = x1;
	yn = y1;

	while (xn <= x2)
	{
		pDC->SetPixel(round(xn), round(yn), color);
		xn++;
		yn += m;
	}
}

void CLine::DDA_02(CDC* pDC, double x1, double y1, double x2, double y2, COLORREF color)
{

	double xn, yn, dx, dy;
	dx = x2 - x1;
	dy = y2 - y1;
	if (dy == 0)
	{
		double xstart = min(x1, x2);
		double xend = max(x1, x2);
		for (double x = xstart; x <= xend; x++)
		{
			pDC->SetPixel(round(x), round(y1), color);
		}
		return;
	}

	double k = (double)dx / dy;
	xn = x1;
	yn = y1;
	while (yn <= y2)
	{
		pDC->SetPixel(round(xn), round(yn), color);
		yn++;
		xn += round(k);
	}
}
void CLine::Bresenham_01(CDC* pDC, double x1, double y1, double x2, double y2, COLORREF color)
{
	double xn, yn, dx, dy, p;
	dx = x2 - x1;
	dy = y2 - y1;
	xn = x1;
	yn = y1;
	p = 2 * dy - dx;
	while (xn <= x2)
	{
		pDC->SetPixel(xn, yn, color);

		if (p < 0)
		{
			p += 2 * dy;
			xn++;
			if (dy < 0) yn--;
		}
		else
		{
			p += 2 * dy - 2 * dx;
			xn++;
			if (dy > 0) yn++;
		}
	}
}
void CLine::Bresenham_02(CDC* pDC, double x1, double y1, double x2, double y2, COLORREF color)
{
	double xn, yn, dx, dy, p;
	dx = x2 - x1;
	dy = y2 - y1;
	xn = x1;
	yn = y1;
	p = 2 * dx - dy;
	while (yn <= y2)
	{
		pDC->SetPixel(xn, yn, color);

		if (p < 0)
		{
			p += 2 * dx;
			yn++;
			if (dx < 0)xn--;
		}
		else
		{
			p += 2 * (dx - dy);
			xn++;
			if (dx > 0) yn++;
		}
	}
}
void CLine::MidPoint(CDC* pDC, double xc, double yc, double r, COLORREF color)
{
	double x = 0;
	double y = r;
	double f = 1 - r;
	while (x <= y)
	{
		pDC->SetPixel(xc + x, yc + y, color);
		pDC->SetPixel(xc - x, yc + y, color);
		pDC->SetPixel(xc + x, yc - y, color);
		pDC->SetPixel(xc - x, yc - y, color);
		pDC->SetPixel(xc + y, yc + x, color);
		pDC->SetPixel(xc - y, yc + x, color);
		pDC->SetPixel(xc + y, yc - x, color);
		pDC->SetPixel(xc - y, yc - x, color);
		if (f < 0)
		{
			f += 2 * x + 3;
			x++;
		}
		else
		{
			x++;
			y--;
			f += 2 * (x - y) + 5;
		}
	}
}
void CLine::DDA(CDC* pDC, double x1, double y1, double x2, double y2, COLORREF color)
{
	double dx = x2 - x1;
	double dy = y2 - y1;

	double steps = abs(dx) > abs(dy) ? abs(dx) : abs(dy);

	double xInc = dx / (double)steps;
	double yInc = dy / (double)steps;

	double x = x1, y = y1;
	for (int i = 0; i <= steps; i++) 
	{
		pDC->SetPixel(round(x), round(y), color);
		x += xInc;
		y += yInc;
	}
}
void CLine::Bresenham(CDC* pDC, double x1, double y1, double x2, double y2, COLORREF color)
{
	int dx = abs(x2 - x1);
	int dy = abs(y2 - y1);
	int stepx = x1 < x2 ? 1 : -1;
	int stepy = y1 < y2 ? 1 : -1;
	int p = dx - dy;
	while (x1 != x2 || y1 != y2) {
		pDC->SetPixel(x1, y1, color);
		int p2 = p * 2;
		if (p2 > -dy) 
		{
			p -= dy;
			x1 += stepx;
		}
		if (p2 < dx) 
		{
			p += dx;
			y1 += stepy;
		}
	}
}
void CLine::Ellipse_MidPoint(CDC* pDC, double x1, double y1, double a, double b, COLORREF color)
{
	int a_sqr = a * a;
	int b_sqr = b * b;
	int two_a_sqr = 2 * a_sqr;
	int two_b_sqr = 2 * b_sqr;
	int x = 0, y = b, p;
	int px = 0, py = two_a_sqr * y;

	// Plot the first set of points 
	pDC->SetPixel(x1 + x, y1 + y, color);
	pDC->SetPixel(x1 - x, y1 + y, color);
	pDC->SetPixel(x1 + x, y1 - y, color);
	pDC->SetPixel(x1 - x, y1 - y, color);

	// Region 1 
	p = round(b_sqr - a_sqr * b + 0.25 * a_sqr);
	while (px < py)
	{
		x++;
		px += two_b_sqr;
		if (p < 0)
			p += b_sqr + px;
		else
		{
			y--;
			py -= two_a_sqr;
			p += b_sqr + px - py;
		}
		pDC->SetPixel(x1 + x, y1 + y, color);
		pDC->SetPixel(x1 - x, y1 + y, color);
		pDC->SetPixel(x1 + x, y1 - y, color);
		pDC->SetPixel(x1 - x, y1 - y, color);
	}

	// Region 2 
	p = round(b_sqr * (x + 0.5) * (x + 0.5) + a_sqr * (y - 1) * (y - 1) - a_sqr * b_sqr);
	while (y > 0)
	{
		y--;
		py -= two_a_sqr;
		if (p > 0)
			p += a_sqr - py;
		else
		{
			x++;
			px += two_b_sqr;
			p += a_sqr - py + px;
		}
		pDC->SetPixel(x1 + x, y1 + y, color);
		pDC->SetPixel(x1 - x, y1 + y, color);
		pDC->SetPixel(x1 + x, y1 - y, color);
		pDC->SetPixel(x1 - x, y1 - y, color);
	}
}
CPolygon CLine::Ellipse_MidPoint_Polygon(CDC* pDC, double x1, double y1, double a, double b)
{
	int point_x[25000];
	int point_y[25000];
	int count = 0;

	CPolygon c;
	int a_sqr = a * a;
	int b_sqr = b * b;
	int two_a_sqr = 2 * a_sqr;
	int two_b_sqr = 2 * b_sqr;
	int x = 0, y = b, p;
	int px = 0, py = two_a_sqr * y;

	// Plot the first set of points 
	c.Add(x1 + x, y1 + y);
	point_x[count] = x;
	point_y[count] = y;
	count++;

	// Region 1 
	p = round(b_sqr - a_sqr * b + 0.25 * a_sqr);
	while (px < py)
	{
		x++;
		px += two_b_sqr;
		if (p < 0)
			p += b_sqr + px;
		else
		{
			y--;
			py -= two_a_sqr;
			p += b_sqr + px - py;
		}
		c.Add(x1 + x, y1 + y);
		point_x[count] = x;
		point_y[count] = y;
		count++;
	}

	// Region 2 
	p = round(b_sqr * (x + 0.5) * (x + 0.5) + a_sqr * (y - 1) * (y - 1) - a_sqr * b_sqr);
	while (y > 0)
	{
		y--;
		py -= two_a_sqr;
		if (p > 0)
			p += a_sqr - py;
		else
		{
			x++;
			px += two_b_sqr;
			p += a_sqr - py + px;
		}
		c.Add(x1 + x, y1 + y);
		point_x[count] = x;
		point_y[count] = y;
		count++;

	}
	for (int i = count - 1; i >= 0; i--)
		c.Add(x1 + point_x[i], y1 - point_y[i]);
	for (int i = 0; i < count; i++)
		c.Add(x1 - point_x[i], y1 - point_y[i]);
	for (int i = count - 1; i >= 0; i--)
		c.Add(x1 - point_x[i], y1 + point_y[i]);
	return c;
}