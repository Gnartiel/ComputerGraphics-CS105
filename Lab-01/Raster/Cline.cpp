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

	while(xn<=x2) 
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
		xn+=round(k);
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