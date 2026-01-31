# Google Stitch Integration Guide

## Purpose
Google Stitch generates UI components from UX intent defined in `spec/design.md`.

## Workflow

### Step 1: Prepare Design Intent
1. Complete `spec/design.md` with:
   - Core user flow
   - Screen purposes
   - Design principles
2. **Do NOT include:** colors, layouts, or specific components
3. Commit: `git commit -am "Lock UX intent"`

### Step 2: Generate UI with Stitch
1. Open Google Stitch
2. Copy entire contents of `spec/design.md`
3. Paste into Stitch prompt with this instruction:

```
Generate a premium, modern UI for this user flow.
Use vibrant colors, smooth animations, and glassmorphism.
Export as React components.
```

### Step 3: Export Components
1. Download generated components from Stitch
2. Place in `frontend/src/components/`
3. Verify component structure:
   ```
   frontend/src/components/
   ├── Home.jsx
   ├── Result.jsx
   ├── Error.jsx
   └── ...
   ```

### Step 4: Commit to GitHub
```bash
git add frontend/src/components/
git commit -m "Add Stitch-generated UI components"
git push
```

## Rules
- ✅ UI now belongs to GitHub (source of truth)
- ✅ Stitch handles visuals, design.md handles intent
- ❌ Do NOT manually edit Stitch components (regenerate instead)
- ❌ Do NOT add UI details to design.md

## Regeneration
If UI needs changes:
1. Update `spec/design.md` with new intent
2. Commit changes
3. Regenerate in Stitch
4. Replace components
5. Commit again

---

**Remember:** Stitch decorates. Spec Kit constrains.
