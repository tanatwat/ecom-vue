<template>
  <div>
    <div class="page-title">
      <h1 class="page-title-heading">Title</h1><a href="#" class="button secondary w-button">ย้อนกลับ</a></div>
    <div class="tab-wrapper"><a href="#" class="tab-button w-button">Button Text</a><a href="#" class="tab-button tab-button-active w-button">Button Text</a></div>
    <div class="w-row">
      <div class="left-column w-col w-col-7">
        <div class="box">
          <h3 class="section-heading">ส่วนลดของร้าน</h3>
          <ul class="no-style-list">
            <li class="collection-list w-clearfix">
              <div class="list-text">Discount</div>
              <div class="action-wrapper"><a href="#" class="button-icon edit w-button">Edit</a><a href="#" class="button-icon delete w-button">Delete</a></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="right-column w-col w-col-5">
        <div class="box">
          <h3 class="section-heading">เพิ่มส่วนลดของร้าน</h3>
          <div class="w-form">
            <form id="email-form" name="email-form" data-name="Email Form">
              <div class="form-group"><label for="name-2" class="form-label">Label</label>
                <div class="input-group"><input type="text" id="name-2" name="name-2" data-name="Name 2" maxlength="256" class="form-input w-input"><input type="text" id="name-2" name="name-2" data-name="Name 2" maxlength="256" class="form-input w-input"></div>
              </div>
            </form>
            <div class="w-form-done">
              <div>Thank you! Your submission has been received!</div>
            </div>
            <div class="w-form-fail">
              <div>Oops! Something went wrong while submitting the form.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <h3 class="section-heading">สินค้าลดราคา</h3>
      <ul class="no-style-list">
        <li class="product-list"><img src="https://d3e54v103j8qbb.cloudfront.net/img/image-placeholder.svg" alt="" class="product-list-img">
          <div class="product-details-wrapper">
            <div class="product-link">Product Name</div>
            <div class="product-detail">Price</div>
            <div class="product-detail">Button</div>
          </div>
        </li>
      </ul>
    </div><a href="#" class="button primary w-button">ตัวเลือกค้นหา</a>
    <div class="filter">
      <div class="w-form">
        <form id="email-form" name="email-form" data-name="Email Form">
          <div class="w-row">
            <div class="left-column w-col w-col-6">
              <div class="form-group"><label for="name-3" class="form-label">Label</label><input type="text" id="name-2" name="name-2" data-name="Name 2" maxlength="256" class="form-input w-input"></div>
            </div>
            <div class="right-column w-col w-col-6">
              <div class="form-group"><label for="name-3" class="form-label">Label</label><input type="text" id="name-2" name="name-2" data-name="Name 2" maxlength="256" class="form-input w-input"></div>
            </div>
          </div>
          <div class="w-row">
            <div class="left-column w-col w-col-6">
              <div class="form-group"><label for="name-3" class="form-label">Label</label><input type="text" id="name-2" name="name-2" data-name="Name 2" maxlength="256" class="form-input w-input"></div>
            </div>
            <div class="right-column w-col w-col-6">
              <div class="form-group"><label for="name-3" class="form-label">Label</label><input type="text" id="name-2" name="name-2" data-name="Name 2" maxlength="256" class="form-input w-input"></div>
            </div>
          </div>
        </form>
        <div class="w-form-done">
          <div>Thank you! Your submission has been received!</div>
        </div>
        <div class="w-form-fail">
          <div>Oops! Something went wrong while submitting the form.</div>
        </div>
      </div>
      <div class="text-right"><a href="#" class="button secondary w-button">ล้างการค้นหา</a><a href="#" class="button submit w-button">ค้นหา</a></div>
    </div>
    <div class="box">
      <h3 class="section-heading">สินค้าภายในร้าน</h3>
      <ul class="no-style-list">
        <li class="product-list"><img src="https://d3e54v103j8qbb.cloudfront.net/img/image-placeholder.svg" alt="" class="product-list-img">
          <div class="product-details-wrapper">
            <div class="product-link">Product Name</div>
            <div class="product-detail">Price</div>
            <div class="product-detail">Button</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
}
</script>
