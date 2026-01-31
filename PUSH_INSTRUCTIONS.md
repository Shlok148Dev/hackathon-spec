# Push to GitHub Instructions

Follow these steps to push your Spec Kit to GitHub:

## Option 1: GitHub Web Interface (Recommended)

### Step 1: Create Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `hackathon-spec`
3. Description: `Spec Kit - Constraint-based hackathon planning system`
4. Choose **Private** or **Public**
5. **DO NOT** check any initialization options (README, .gitignore, license)
6. Click **"Create repository"**

### Step 2: Push Your Local Repository
After creating the repo, GitHub will show you commands. Run these:

```powershell
cd "C:\Users\hp\Desktop\Cyber Cypher\hackathon-spec"

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/hackathon-spec.git

# Push to GitHub
git branch -M master
git push -u origin master
```

### Step 3: Verify
Refresh your GitHub repository page. You should see all files.

---

## Option 2: GitHub CLI (If Installed)

```powershell
cd "C:\Users\hp\Desktop\Cyber Cypher\hackathon-spec"

# Authenticate (if not already)
gh auth login

# Create repo and push in one command
gh repo create hackathon-spec --private --source=. --remote=origin --push
```

---

## Troubleshooting

### Authentication Error
If prompted for credentials:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)
  - Create at: https://github.com/settings/tokens
  - Scopes needed: `repo`

### Wrong Username
Replace `YOUR_USERNAME` with your actual GitHub username in the remote URL.

---

## After Pushing

✅ **Your Spec Kit is now backed up**
✅ **GitHub is your source of truth**
✅ **Ready for hackathon**

**Next:** Wait for problem statement to drop, then execute Phase B.
