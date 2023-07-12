#pragma once
#include "pch.h"
#include "CFill.h"
#ifndef _CLine
#define _CLine
class CLine
{
public:
	void DDA_01(CDC*, double, double, double, double, COLORREF);
	void DDA_02(CDC*, double, double, double, double, COLORREF);
	void Bresenham_01(CDC*, double, double, double, double, COLORREF);
	void Bresenham_02(CDC*, double, double, double, double, COLORREF);
	void MidPoint(CDC*, double, double, double, COLORREF);
	void DDA(CDC*, double, double, double, double, COLORREF);
	void Bresenham(CDC*, double, double, double, double, COLORREF);
	void Ellipse_MidPoint(CDC*, double, double, double, double, COLORREF);
	CPolygon Ellipse_MidPoint_Polygon(CDC*, double, double, double, double);
};
#endif