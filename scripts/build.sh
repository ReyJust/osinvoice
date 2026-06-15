# 1. Never redeploy the same SHA
if [ "$VERCEL_GIT_PREVIOUS_SHA" = "$VERCEL_GIT_COMMIT_SHA" ]; then
  exit 0
fi

# 2. Always deploy previews (non-main branches)
if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then
  exit 1
fi

# 3. Skip deploy if commit message contains skip-cd
if echo "$VERCEL_GIT_COMMIT_MESSAGE" | grep -qi "skip-cd"; then
  exit 0
fi

# 4. Otherwise deploy
exit 1