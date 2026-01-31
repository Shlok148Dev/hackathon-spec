# GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `hackathon-spec`
3. Description: "Spec Kit - Constraint-based hackathon planning system"
4. **Keep it Private** (or Public if you prefer)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 2: Connect Local Repository

GitHub will show you commands. Use these:

```bash
cd "C:\Users\hp\Desktop\Cyber Cypher\hackathon-spec"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/hackathon-spec.git

# Push to GitHub
git push -u origin master
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Verify

1. Refresh your GitHub repository page
2. You should see:
   ```
   hackathon-spec/
   ├── spec/
   ├── frontend/
   ├── backend/
   ├── demo/
   ├── docs/
   ├── README.md
   ├── DEMO.md
   ├── DECISIONS.md
   ├── QUICK_REFERENCE.md
   └── .gitignore
   ```

## Step 4: Protect Master Branch (Optional but Recommended)

1. Go to repository Settings → Branches
2. Add rule for `master`
3. Enable:
   - Require pull request reviews (optional)
   - Require status checks to pass (optional)

This prevents accidental force pushes during hackathon chaos.

## Alternative: GitHub CLI

If you have GitHub CLI installed:

```bash
cd "C:\Users\hp\Desktop\Cyber Cypher\hackathon-spec"

# Create repo and push
gh repo create hackathon-spec --private --source=. --remote=origin --push
```

## Troubleshooting

### Authentication Issues

If push fails with authentication error:

**Option 1: Personal Access Token**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo`
4. Copy token
5. When prompted for password, paste token

**Option 2: GitHub CLI**
```bash
gh auth login
```

### Wrong Remote URL

If you added wrong remote:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/hackathon-spec.git
```

## Next Steps

Once pushed to GitHub:

1. ✅ **GitHub is now your source of truth**
2. ✅ **Clone on any machine for hackathon**
3. ✅ **Team members can collaborate**
4. ✅ **Rollback points are safe**

## During Hackathon

When problem statement drops:

```bash
# Pull latest
git pull

# Follow Phase B workflow
# Edit spec files
# Commit after each phase

git commit -am "Lock problem context"
git push

git commit -am "Lock technical constraints"
git push

git commit -am "Lock execution tasks"
git push

git commit -am "Lock UX intent"
git push
```

---

**Your Spec Kit is ready. GitHub is your safety net.**
