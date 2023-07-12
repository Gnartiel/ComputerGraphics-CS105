#pragma once
#include "pch.h"
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
};
#endif