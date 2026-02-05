# Student Dashboard Alignment Style Guide

This document outlines the alignment standards and UI patterns for the Student Dashboard pages to ensure consistency, accessibility, and pixel-perfect layout.

## 1. Grid & Layout System

### Main Container
All pages must use a consistent container wrapper to ensure proper centering and maximum width on large screens.

```tsx
<div className="container mx-auto p-4 md:p-6 max-w-7xl">
  {/* Page Content */}
</div>
```

- **Padding**: `p-4` (mobile) to `md:p-6` (tablet/desktop).
- **Max Width**: `max-w-7xl` (1280px) for standard dashboard pages.
- **Centering**: `mx-auto`.

### Spacing (Baseline Grid)
Use the 4px baseline grid system (Tailwind `gap-1` = 4px).
- **Major Sections**: `gap-6` (24px) or `space-y-6`.
- **Card Grids**: `gap-4` (16px).
- **Internal Component Spacing**: `gap-2` (8px) or `gap-3` (12px).

## 2. Component Alignment

### Text Alignment
- **General Text**: Explicitly `text-left` (default). Avoid `text-center` for long content.
- **Headings**: Left-aligned.
- **Data Tables**: 
  - Text columns (e.g., Subject, Remark): Left-aligned.
  - Numeric columns (e.g., Scores, Total): Center-aligned (`text-center`).
  - Status/Badges: Center-aligned.

### Flexbox & Grid Patterns

#### Cards
All cards should use Flexbox for header alignment.

**Stats Card Pattern:**
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Title</CardTitle>
    <Icon className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">Value</div>
    <p className="text-xs text-muted-foreground">Description</p>
  </CardContent>
</Card>
```

#### Quick Actions
Quick actions should be left-aligned for better scanability.

```tsx
<CardContent className="flex flex-row items-center justify-start p-4 text-left gap-4">
  <div className="icon-wrapper shrink-0">
    <Icon />
  </div>
  <Label />
</CardContent>
```

### Vertical Centering
Always use `items-center` (Flex) or `content-center` (Grid) to ensure vertical centering of elements within their containers.

```tsx
// Correct
<div className="flex items-center space-x-2">
  <Icon />
  <span>Text</span>
</div>
```

## 3. Responsive Breakpoints

- **Mobile (< 640px)**: 
  - Single column layouts (`grid-cols-1`).
  - `p-4` padding.
  - Stacked flex containers (`flex-col`).
- **Tablet (768px)**:
  - `md:grid-cols-2` or `md:grid-cols-3`.
  - `md:p-6` padding.
- **Desktop (1024px+)**:
  - `lg:grid-cols-4`.
  - Max width constraints apply.

## 4. Accessibility (WCAG 2.1 AA)

- **Contrast**: Ensure text has a contrast ratio of at least 4.5:1 against the background.
- **Focus States**: All interactive elements must have visible focus rings (`focus-visible:ring-2`).
- **Structure**: Use semantic HTML (`<main>`, `<h1>`, `<table>`, `<article>`).

## 5. Visual Regression Testing Checklist

When verifying alignment:
1.  [ ] Check that all page titles align with the left edge of the content container.
2.  [ ] Verify that all card headers in a grid row are aligned.
3.  [ ] Ensure table cell content is vertically centered.
4.  [ ] Confirm consistent gap spacing (16px/24px) between all major blocks.
