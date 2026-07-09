1. **Remove unused imports** in `src/components/builder/ui-contracts/UiContractDetailPanel.tsx` (like `Copy` if it's unused or not necessary anymore - actually wait `Copy` is used. But what about the `err` variable? We need to prefix it with `_` or use it). We saw: `25:16 warning 'err' is defined but never used @typescript-eslint/no-unused-vars`. I will change `catch (err)` to `catch (_err)` or simply `catch`. Let's check `catch (err)` and change to `catch (_err)`.

2. **Replace array index keys with stable keys** in `UiContractDetailPanel.tsx`.
   - `data.map((item, idx) => <li key={idx}>...</li>)` -> `<li key={item}>...</li>` (since they are strings).
   - `contract.data_inputs.map((item, i) => <li key={i}>{item}</li>)` -> `<li key={item}>{item}</li>`
   - `contract.data_outputs.map((item, i) => <li key={i}>{item}</li>)` -> `<li key={item}>{item}</li>`
   - `contract.commands.map((cmd, i) => <span key={i}>...</span>)` -> `<span key={cmd}>...</span>`
   - `contract.related_tasks.map((task, i) => <li key={i}>...</li>)` -> `<li key={task}>...</li>`
   - `contract.related_reviews.map((rev, i) => <li key={i}>...</li>)` -> `<li key={rev}>...</li>`
   - `contract.dependencies.map((dep, i) => <div key={i}>...</div>)` -> `<div key={dep.id}>...</div>` (since `dep` has an `id` property, based on `UiContractDependency`).

3. **Check other files for array index keys**:
   - `UiContractList.tsx`: `contracts.map((contract) => (<div key={contract.id}>` (already stable).
   - `UiContractImplementationMatrix.tsx`: `groups.map((group) => (<div key={group.id}>` and `groupContracts.map((contract) => (<div key={contract.id}>` (already stable).
   - `UiContractFilters.tsx`: `groups.map((g) => (<button key={g.value}>` (already stable).

4. **Defensive rendering**:
   - Check if `contract.data_inputs`, `contract.data_outputs`, etc., are defined before calling `.length` or `.map`. Currently it's `{contract.data_inputs.length > 0 ? ...}`. If `data_inputs` is undefined, this will crash. We should use `contract.data_inputs?.length > 0` and `contract.data_inputs?.map(...)`.
   - Update `UiContractDetailPanel.tsx` to handle `contract.data_inputs?.length > 0`, `contract.data_outputs?.length > 0`, `contract.commands?.length > 0`, `contract.related_tasks?.length > 0`, `contract.related_reviews?.length > 0`, `contract.dependencies?.length > 0`.
   - Check if we need optional chaining in other places.

5. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
