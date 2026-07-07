(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        var provinceEl = document.getElementById('id_province');
        var districtEl = document.getElementById('id_district');
        var communeEl = document.getElementById('id_commune');
        var villageEl = document.getElementById('id_village');
        if (!provinceEl || !districtEl || !communeEl || !villageEl) return;

        var ajaxBase = window.location.pathname.replace(/(add|\d+\/change)\/$/, '') + 'ajax/';

        var initialDistrict = districtEl.value;
        var initialCommune = communeEl.value;
        var initialVillage = villageEl.value;

        function updateDisabledState() {
            districtEl.disabled = !provinceEl.value;
            communeEl.disabled = (!districtEl.value || districtEl.disabled);
            villageEl.disabled = (!communeEl.value || communeEl.disabled);
            
            var $jq = window.jQuery || (window.django && window.django.jQuery);
            if ($jq) {
                if ($jq(districtEl).hasClass('select2-hidden-accessible')) $jq(districtEl).trigger('change.select2');
                if ($jq(communeEl).hasClass('select2-hidden-accessible')) $jq(communeEl).trigger('change.select2');
                if ($jq(villageEl).hasClass('select2-hidden-accessible')) $jq(villageEl).trigger('change.select2');
            }
        }

        function resetSelect(selectEl) {
            selectEl.innerHTML = '<option value="">---------</option>';
            var $jq = window.jQuery || (window.django && window.django.jQuery);
            if ($jq && $jq(selectEl).hasClass('select2-hidden-accessible')) {
                $jq(selectEl).trigger('change.select2');
            }
            updateDisabledState();
        }

        function fillSelect(selectEl, items, selectedValue) {
            selectEl.innerHTML = '<option value="">---------</option>';
            items.forEach(function (item) {
                var opt = document.createElement('option');
                opt.value = item.code;
                opt.textContent = item.name;
                if (item.code === selectedValue) opt.selected = true;
                selectEl.appendChild(opt);
            });
            var $jq = window.jQuery || (window.django && window.django.jQuery);
            if ($jq && $jq(selectEl).hasClass('select2-hidden-accessible')) {
                $jq(selectEl).trigger('change.select2');
            }
            updateDisabledState();
        }

        function loadChildren(url, selectEl, selectedValue, onDone) {
            fetch(url, { credentials: 'same-origin' })
                .then(function (resp) { return resp.json(); })
                .then(function (items) {
                    fillSelect(selectEl, items, selectedValue);
                    if (onDone) onDone();
                })
                .catch(function () { resetSelect(selectEl); if (onDone) onDone(); });
        }

        function onProvinceChange(selectedDistrict, selectedCommune, selectedVillage) {
            if (!provinceEl.value) {
                resetSelect(districtEl);
                resetSelect(communeEl);
                resetSelect(villageEl);
                return;
            }
            loadChildren(
                ajaxBase + 'districts/?province_code=' + encodeURIComponent(provinceEl.value),
                districtEl,
                selectedDistrict,
                function () { onDistrictChange(selectedCommune, selectedVillage); }
            );
        }

        function onDistrictChange(selectedCommune, selectedVillage) {
            if (!districtEl.value) {
                resetSelect(communeEl);
                resetSelect(villageEl);
                return;
            }
            loadChildren(
                ajaxBase + 'communes/?district_code=' + encodeURIComponent(districtEl.value),
                communeEl,
                selectedCommune,
                function () { onCommuneChange(selectedVillage); }
            );
        }

        function onCommuneChange(selectedVillage) {
            if (!communeEl.value) {
                resetSelect(villageEl);
                return;
            }
            loadChildren(
                ajaxBase + 'villages/?commune_code=' + encodeURIComponent(communeEl.value),
                villageEl,
                selectedVillage
            );
        }

        var $jq = window.jQuery || (window.django && window.django.jQuery);
        if ($jq) {
            $jq(provinceEl).on('change', function () { onProvinceChange(); });
            $jq(districtEl).on('change', function () { onDistrictChange(); });
            $jq(communeEl).on('change', function () { onCommuneChange(); });
        } else {
            provinceEl.addEventListener('change', function () { onProvinceChange(); });
            districtEl.addEventListener('change', function () { onDistrictChange(); });
            communeEl.addEventListener('change', function () { onCommuneChange(); });
        }

        if (provinceEl.value) {
            onProvinceChange(initialDistrict, initialCommune, initialVillage);
        } else {
            updateDisabledState();
        }
    });
})();
