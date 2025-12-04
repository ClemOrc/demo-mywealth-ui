# 🎭 Mock System Quick Reference

## Enable/Disable

```javascript
// Browser Console
mockConfig.enable()      // Enable mocks
mockConfig.disable()     // Use real BFF
```

```bash
# .env file
REACT_APP_USE_MOCKS=true
```

## Configuration

```javascript
mockConfig.setDelay(500)              // Add 500ms delay
mockConfig.enableErrors(0.2)          // 20% failure rate
mockConfig.setSpecificError(          // Force specific error
  'createAgreement', 
  'Permission denied'
)
```

## Information

```javascript
mockConfig.help()        // Show all commands
mockConfig.getCurrent()  // View current config
```

## Mock Data Available

- **12 Agreements** (7 active, 1 pending, 1 draft, 1 suspended, 2 expired)
- **10 Clients** (7 individuals, 3 corporations)
- **8 Products** (all categories)
- **3 Modification Requests**
- **4 Asset Allocation Policies**
- **3 Accounts**, **2 Household Members**

## All Features Work

✅ Dashboard with filters
✅ Create agreement (8-step wizard)
✅ View agreement details
✅ Modify agreements
✅ Approve/reject modifications
✅ Search and filter
✅ Pagination and sorting

## Documentation

- **Complete Guide**: `MOCK_SYSTEM_GUIDE.md`
- **Implementation**: `MOCK_IMPLEMENTATION_SUMMARY.md`
- **Main README**: `README.md`

---

**Start now:** Type `mockConfig.enable()` in browser console!
