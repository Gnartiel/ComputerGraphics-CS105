
// ColorView.cpp : implementation of the CColorView class
//

#include "pch.h"
#include "framework.h"
// SHARED_HANDLERS can be defined in an ATL project implementing preview, thumbnail
// and search filter handlers and allows sharing of document code with that project.
#ifndef SHARED_HANDLERS
#include "Color.h"
#endif

#include "ColorDoc.h"
#include "ColorView.h"
#include "Cline.h"
#include "CShape.h"
#include "CFill.h"
#ifdef _DEBUG
#define new DEBUG_NEW
#endif


// CColorView

IMPLEMENT_DYNCREATE(CColorView, CView)

BEGIN_MESSAGE_MAP(CColorView, CView)
	// Standard printing commands
	ON_COMMAND(ID_FILE_PRINT, &CView::OnFilePrint)
	ON_COMMAND(ID_FILE_PRINT_DIRECT, &CView::OnFilePrint)
	ON_COMMAND(ID_FILE_PRINT_PREVIEW, &CColorView::OnFilePrintPreview)
	ON_WM_CONTEXTMENU()
	ON_WM_RBUTTONUP()
END_MESSAGE_MAP()

// CColorView construction/destruction

CColorView::CColorView() noexcept
{
	// TODO: add construction code here

}

CColorView::~CColorView()
{
}

BOOL CColorView::PreCreateWindow(CREATESTRUCT& cs)
{
	// TODO: Modify the Window class or styles here by modifying
	//  the CREATESTRUCT cs

	return CView::PreCreateWindow(cs);
}

// CColorView drawing

void CColorView::OnDraw(CDC* pDC /*pDC*/)
{
	CColorDoc* pDoc = GetDocument();
	ASSERT_VALID(pDoc);
	if (!pDoc)
		return;

	// TODO: add draw code for native data here
	CLine line;
	CShape s;
	CFill f;
	CPolygon p;
	int name = 12;
	switch (name)
	{
	case 1: // tăng chậm và giảm chậm
		line.DDA_01(pDC, 100, 100, 300, 200, RGB(0, 0, 255));//x1,y1,x2,y2
		break;
	case 2: // tăng nhanh và giảm nhanh
		//line.Bresenham_02(pDC, 100, 200, 300, 500, RGB(0, 0, 0));
		line.DDA_02(pDC, 100, 200, 300, 500, RGB(255, 0, 0));//x1,y1,x2,y2
		break;
	case 3:
		line.Bresenham_01(pDC, 100, 200, 300, 500, RGB(0, 255, 0));
		break;
	case 4:
		line.Bresenham_02(pDC, 100, 100, 300, 500, RGB(0, 0, 0));
		break;
	case 5:
		line.MidPoint(pDC, 300, 300, 300, RGB(200, 100, 255));
		break;
	case 6:
		s.Star(pDC, 300, 300, 500, RGB(200, 100, 255));
		break;
	case 7:
		s.Pentagon(pDC, 300, 300, 300, RGB(200, 100, 255));
		break;
	case 8:
		s.Hexagon(pDC, 300, 300, 300, RGB(200, 100, 255));
		break;
	case 9:
		s.Hexagon(pDC, 300, 300, 100, RGB(200, 100, 255));
		f.BoundaryFillEnhanced(pDC, 300, 300, RGB(200, 100, 255));
		break;
	case 10:
		s.Star(pDC, 300, 300, 100, RGB(200, 0, 0));
		f.BoundaryFillEnhanced(pDC, 300, 300, RGB(255, 191, 0));
		break;
	case 11: //ellipse using BoundaryFill
		line.Ellipse_MidPoint(pDC, 300, 300, 70, 100, RGB(200, 0, 0));
		f.BoundaryFillEnhanced(pDC, 300, 300, RGB(255, 191, 0));
		break;
	case 12: //ellipse using scan line fill
	{
		CPolygon polygon;
		polygon = line.Ellipse_MidPoint_Polygon(pDC, 300, 300, 60, 90);

		polygon.Draw(pDC, RGB(200, 0, 0));
		f.ScanLineFill(pDC, polygon, RGB(255, 191, 0));
		ReleaseDC(pDC);
		break; 
	}
	default:
		break;
	}
}


// CColorView printing


void CColorView::OnFilePrintPreview()
{
#ifndef SHARED_HANDLERS
	AFXPrintPreview(this);
#endif
}

BOOL CColorView::OnPreparePrinting(CPrintInfo* pInfo)
{
	// default preparation
	return DoPreparePrinting(pInfo);
}

void CColorView::OnBeginPrinting(CDC* /*pDC*/, CPrintInfo* /*pInfo*/)
{
	// TODO: add extra initialization before printing
}

void CColorView::OnEndPrinting(CDC* /*pDC*/, CPrintInfo* /*pInfo*/)
{
	// TODO: add cleanup after printing
}

void CColorView::OnRButtonUp(UINT /* nFlags */, CPoint point)
{
	ClientToScreen(&point);
	OnContextMenu(this, point);
}

void CColorView::OnContextMenu(CWnd* /* pWnd */, CPoint point)
{
#ifndef SHARED_HANDLERS
	theApp.GetContextMenuManager()->ShowPopupMenu(IDR_POPUP_EDIT, point.x, point.y, this, TRUE);
#endif
}


// CColorView diagnostics

#ifdef _DEBUG
void CColorView::AssertValid() const
{
	CView::AssertValid();
}

void CColorView::Dump(CDumpContext& dc) const
{
	CView::Dump(dc);
}

CColorDoc* CColorView::GetDocument() const // non-debug version is inline
{
	ASSERT(m_pDocument->IsKindOf(RUNTIME_CLASS(CColorDoc)));
	return (CColorDoc*)m_pDocument;
}
#endif //_DEBUG


// CColorView message handlers
