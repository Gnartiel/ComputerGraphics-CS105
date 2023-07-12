
// RasterView.cpp : implementation of the CRasterView class
//

#include "pch.h"
#include "framework.h"
// SHARED_HANDLERS can be defined in an ATL project implementing preview, thumbnail
// and search filter handlers and allows sharing of document code with that project.
#ifndef SHARED_HANDLERS
#include "Raster.h"
#endif

#include "RasterDoc.h"
#include "RasterView.h"
#include "Cline.h"
#ifdef _DEBUG
#define new DEBUG_NEW
#endif


// CRasterView

IMPLEMENT_DYNCREATE(CRasterView, CView)

BEGIN_MESSAGE_MAP(CRasterView, CView)
	// Standard printing commands
	ON_COMMAND(ID_FILE_PRINT, &CView::OnFilePrint)
	ON_COMMAND(ID_FILE_PRINT_DIRECT, &CView::OnFilePrint)
	ON_COMMAND(ID_FILE_PRINT_PREVIEW, &CRasterView::OnFilePrintPreview)
	ON_WM_CONTEXTMENU()
	ON_WM_RBUTTONUP()
END_MESSAGE_MAP()

// CRasterView construction/destruction

CRasterView::CRasterView() noexcept
{
	// TODO: add construction code here

}

CRasterView::~CRasterView()
{
}

BOOL CRasterView::PreCreateWindow(CREATESTRUCT& cs)
{
	// TODO: Modify the Window class or styles here by modifying
	//  the CREATESTRUCT cs

	return CView::PreCreateWindow(cs);
}

// CRasterView drawing

void CRasterView::OnDraw(CDC* pDC)
{
	CRasterDoc* pDoc = GetDocument();
	ASSERT_VALID(pDoc);
	if (!pDoc)
		return;
	CLine line;
	int name = 1;
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
		line.MidPoint(pDC, 300, 300, 10, RGB(200, 100, 255));
		break;
	default:
		break;
	}
	// TODO: add draw code for native data here
	/*COLORREF qLineColor = RGB(0, 0, 255);
	CPen qLinePen(PS_SOLID, 7, qLineColor);
	pDC->SelectObject(&qLinePen);
	pDC->MoveTo(100, 300);
	pDC->LineTo(300, 200);*/
}


// CRasterView printing


void CRasterView::OnFilePrintPreview()
{
#ifndef SHARED_HANDLERS
	AFXPrintPreview(this);
#endif
}

BOOL CRasterView::OnPreparePrinting(CPrintInfo* pInfo)
{
	// default preparation
	return DoPreparePrinting(pInfo);
}

void CRasterView::OnBeginPrinting(CDC* /*pDC*/, CPrintInfo* /*pInfo*/)
{
	// TODO: add extra initialization before printing
}

void CRasterView::OnEndPrinting(CDC* /*pDC*/, CPrintInfo* /*pInfo*/)
{
	// TODO: add cleanup after printing
}

void CRasterView::OnRButtonUp(UINT /* nFlags */, CPoint point)
{
	ClientToScreen(&point);
	OnContextMenu(this, point);
}

void CRasterView::OnContextMenu(CWnd* /* pWnd */, CPoint point)
{
#ifndef SHARED_HANDLERS
	theApp.GetContextMenuManager()->ShowPopupMenu(IDR_POPUP_EDIT, point.x, point.y, this, TRUE);
#endif
}


// CRasterView diagnostics

#ifdef _DEBUG
void CRasterView::AssertValid() const
{
	CView::AssertValid();
}

void CRasterView::Dump(CDumpContext& dc) const
{
	CView::Dump(dc);
}

CRasterDoc* CRasterView::GetDocument() const // non-debug version is inline
{
	ASSERT(m_pDocument->IsKindOf(RUNTIME_CLASS(CRasterDoc)));
	return (CRasterDoc*)m_pDocument;
}
#endif //_DEBUG


// CRasterView message handlers
