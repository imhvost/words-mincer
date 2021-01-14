<template>
  <div class="page-content home">
    <div class="container">
      <back-btn/>
      <div
        v-if="lang === 'ru'"
        class="content-text">
        <p class="promo">Случилось страшное! Слова попали в мясорубку и превратились в фарш! И только ты сможешь слепить из букв словесные котлеты... ))</p>
        <h2 class="greet">Приветствуем вас в игре «МЯСОРУБКА СЛОВ»!</h2>
        <p>Суть игры – составить из перемешанных букв нужное количество слов, зарабатывая при этом монеты и двигаясь дальше. Сложность игры возрастает с каждым новым уровнем, поэтому у вас есть подсказки и различные бонусы.</p>
        <p><b>Перед вами интерфейс игры:</b></p>
        <p>
          <img
            src="/static/img/screen-game.jpg"
            class="screen"
            alt="Интерфейс игры">
        </p>
        <p>Тут:</p>
        <ul class="desc-list">
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-level.jpg"
                  alt="Текущий уровень">
              </div>
              <div class="desc-list-screen-info">Текущий уровень (2) раздела (20)</div>
            </div>
            <div class="desc-list-info">Всего в игре 20 разделов. В каждом разделе - 20 уровней + 2 бонусных (особо сложных).</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-timer.jpg"
                  alt="Таймер">
              </div>
              <div class="desc-list-screen-info">Таймер</div>
            </div>
            <div class="desc-list-info">Если успеть разгадать все слова, то будут получены дополнительные монеты! Время таймера, а так же количество дополнительных монет зависит от текущего уровня игры.</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-stricke.jpg"
                  alt="Страйк">
              </div>
              <div class="desc-list-screen-info">Страйк</div>
            </div>
            <div class="desc-list-info">Вы можете получить дополнительные монеты, отгадывая слова подряд без ошибок! Длина страйка, а так же количество дополнительных монет зависит от текущего уровня игры.</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-coins.jpg"
                  alt="Монеты">
              </div>
              <div class="desc-list-screen-info">Монеты</div>
            </div>
            <div class="desc-list-info">Это то, что вы имеете в кармане )) Кстати, чем больше длина отгаданного (или помещенного в копилку) слова, тем больше вы получите монет!</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-shop-icon.jpg"
                  alt="Магазин">
              </div>
              <div class="desc-list-screen-info">Магазин</div>
            </div>
            <div class="desc-list-info">Вход в магазин</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon desc-list-screen-icon-big">
                <img
                  src="/static/img/screen-inputs.jpg"
                  alt="То, что нужно отгадать">
              </div>
              <div class="desc-list-screen-info">То, что нужно отгадать</div>
            </div>
            <div class="desc-list-info">Именно столько слов вам необходимо составить. Учтите, если слов, например, из 5-ти букв нет в этом месте, или они все уже отгаданы, то дальнейшее введение правильных ответов из 5-ти букв будут считаться ошибками.</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon desc-list-screen-icon-big">
                <img
                  src="/static/img/screen-task.jpg"
                  alt="Фарш из букв">
              </div>
              <div class="desc-list-screen-info">Фарш из букв</div>
            </div>
            <div class="desc-list-info">Из этих букв и нужно составлять слова! Для этого (в зависимости от настроек) можно либо рисовать пальцем по экрану, соединяя буквы линиями, либо нажимать на буквы, либо вводить слово в соответствующее поле.</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-answers.jpg"
                  alt="Список отгаданых слов">
              </div>
              <div class="desc-list-screen-info">Список отгаданых слов</div>
            </div>
            <div class="desc-list-info">Можно посмотреть значения отгаданых слов</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-treasure.jpg"
                  alt="Копилка">
              </div>
              <div class="desc-list-screen-info">Копилка</div>
            </div>
            <div class="desc-list-info">Иногда слов бывает больше, чем нужно )) Для этого и существует копилка, в которую помещаются эти слова. Также, за это вы, конечно же, получите дополнительные монеты!</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-errors.jpg"
                  alt="Ошибки">
              </div>
              <div class="desc-list-screen-info">Ошибки</div>
            </div>
            <div class="desc-list-info">Ошибаются всё... Если вы уверены в том, что вводите правильное слово, но это слово попадает сюда, вы можете помочь нам расширить словарь, добавив это слово собственноручно.</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-openFirstLetters.jpg"
                  alt="Открывашка">
              </div>
              <div class="desc-list-screen-info">Открывашка</div>
            </div>
            <div class="desc-list-info">Эта подсказка открывает первые буквы! Каждую подсказку можно усилить в магазине (за монеты), чтобы она открывала больше букв!</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-openLastLetters.jpg"
                  alt="Штопор">
              </div>
              <div class="desc-list-screen-info">Штопор</div>
            </div>
            <div class="desc-list-info">Эта подсказка открывает последние буквы! Советуем вам экономить подсказки, так как игра постоянно усложняется. И, уж поверьте, подсказок будет не хватать...</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-bomb.jpg"
                  alt="Бомба">
              </div>
              <div class="desc-list-screen-info">Бомба</div>
            </div>
            <div class="desc-list-info">Эта подсказка открывает случайные буквы! Учтите, в бонусных уровнях, к сожалению, подсказками пользоваться не будет возможности. Но на то они и бонусные (особосложные)!</div>
          </li>
        </ul>
        <hr>
        <p>Для того, чтобы настроить игру под себя, нажмите на свой профиль, рядом с которым расположена шестеренка. Вы попадете на эту страницу:</p>
        <p>
          <img
            src="/static/img/screen-settings.jpg"
            class="screen"
            alt="Кабинет">
        </p>
        <p>Нажав на вкладку "Инфо" вы попадете на страницу со статистикой вашего профиля:</p>
        <p>
          <img
            src="/static/img/screen-info.jpg"
            class="screen"
            alt="Профиль">
        </p>
        <p>Также, после некоторых действий, вы можете получить награды! Перейдите на вкладку "Достижения", чтобы посмотреть их:</p>
        <p>
          <img
            src="/static/img/screen-awards.jpg"
            class="screen"
            alt="Достижения">
        </p>
        <p>Учтите, что у достижений открыты только названия. А вот как их получить - придется подумать или призвать на помошь собственную удачу.</p>
        <p>Магазин выглядит так:</p>
        <p>
          <img
            src="/static/img/screen-shop.jpg"
            class="screen"
            alt="Магазин">
        </p>
        <p>Зайти в него можно либо со страницы своего профиля, либо со страницы игры.</p>
        <p>В магазине вы можете как купить подсказки, так и "прокачать" их.</p>
        <p>
          <img
            src="/static/img/screen-shop-levelUp.jpg"
            class="screen"
            alt="Магазин">
        </p>
        <p>Желаем вам удачной и веселой игры!</p>
        <p>По всем вопросам и пожеланиям можете написать нам на почту:
          <a
            href="mailto:imhvost@gmail.com"
            target="_blank">imhvost@gmail.com</a>
        </p>
        <p>
          <router-link
            exact
            tag="a"
            to="/privacy-policy"
            @click.native="$root.playAudio('click')">
            <span>Политика конфиденциальности</span>
          </router-link>
        </p>
      </div>
      <div
        v-if="lang === 'uk'"
        class="content-text">
        <p class="promo">Сталося страшне! Слова потрапили в м'ясорубку і перетворилися в фарш! І тільки ти зможеш зліпити з букв словесні котлети... ))</p>
        <h2 class="greet">Вітаємо вас в грі «М'ЯСОРУБКА СЛІВ»!</h2>
        <p>Суть гри - скласти з перемішаних букв потрібну кількість слів, заробляючи при цьому монети і рухаючись далі. Складність гри зростає з кожним новим рівнем, тому у вас є підказки і різні бонуси.</p>
        <p><b>Перед вами інтерфейс гри:</b></p>
        <p>
          <img
            src="/static/img/screen-game.jpg"
            class="screen"
            alt="Інтерфейс гри">
        </p>
        <p>Тут:</p>
        <ul class="desc-list">
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-level.jpg"
                  alt="Поточний рівень">
              </div>
              <div class="desc-list-screen-info">Поточний рівень (2) розділу (20)</div>
            </div>
            <div class="desc-list-info">Всього в грі 20 розділів. У кожному розділі - 20 рівнів + 2 бонусних (особливо складних).</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-timer.jpg"
                  alt="Таймер">
              </div>
              <div class="desc-list-screen-info">Таймер</div>
            </div>
            <div class="desc-list-info">Якщо встигнути розгадати всі слова, то будуть отримані додаткові монети! Час таймера, а також кількість додаткових монет, залежить від поточного рівня гри.</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-stricke.jpg"
                  alt="Страйк">
              </div>
              <div class="desc-list-screen-info">Страйк</div>
            </div>
            <div class="desc-list-info">Ви можете отримати додаткові монети, відгадуючи слова поспіль без помилок! Довжина страйку, а також кількість додаткових монет, залежить від поточного рівня гри.</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-coins.jpg"
                  alt="Монеты">
              </div>
              <div class="desc-list-screen-info">Монети</div>
            </div>
            <div class="desc-list-info">Це те, що ви маєте в кишені)) До речі, чим більше довжина відгаданого (або доданого у скарбничку) слова, тим більше ви отримаєте монет!</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-shop-icon.jpg"
                  alt="Магазин">
              </div>
              <div class="desc-list-screen-info">Магазин</div>
            </div>
            <div class="desc-list-info">Вхід в магазин</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon desc-list-screen-icon-big">
                <img
                  src="/static/img/screen-inputs.jpg"
                  alt="Те, що потрібно відгадати">
              </div>
              <div class="desc-list-screen-info">Те, що потрібно відгадати</div>
            </div>
            <div class="desc-list-info">Саме стільки слів вам необхідно скласти. Врахуйте, якщо слів, наприклад, з 5-ти букв немає в цьому місці, або вони всі вже відгадані, то подальше введення правильних відповідей з 5-ти букв будуть вважатися помилками.</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon desc-list-screen-icon-big">
                <img
                  src="/static/img/screen-task.jpg"
                  alt="Фарш з букв">
              </div>
              <div class="desc-list-screen-info">Фарш з букв</div>
            </div>
            <div class="desc-list-info">З цих букв і потрібно складати слова! Для цього (в залежності від налаштувань) можна або малювати пальцем по екрану, поєднуючи букви лініями, або натискати на літери, або вводити слово у відповідне поле.</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-answers.jpg"
                  alt="Список отгаданих слів">
              </div>
              <div class="desc-list-screen-info">Список отгаданих слів</div>
            </div>
            <div class="desc-list-info">Можна подивитися значення отгаданих слів</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-treasure.jpg"
                  alt="Скарбничка">
              </div>
              <div class="desc-list-screen-info">Скарбничка</div>
            </div>
            <div class="desc-list-info">Іноді слів буває більше, ніж потрібно)) Для цього і існує скарбничка, в яку поміщаються ці слова. Також, за це ви, звичайно ж, отримаєте додаткові монети!</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-errors.jpg"
                  alt="Помилки">
              </div>
              <div class="desc-list-screen-info">Помилки</div>
            </div>
            <div class="desc-list-info">Помиляються все ... Якщо ви впевнені в тому, що вводите правильне слово, але це слово потрапляє сюди, ви можете допомогти нам розширити словник, додавши це слово власноруч.</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-openFirstLetters.jpg"
                  alt="Відкривачка">
              </div>
              <div class="desc-list-screen-info">Відкривачка</div>
            </div>
            <div class="desc-list-info">Ця підказка відкриває перші літери! Кожну підказку можна посилити в магазині (за монети), щоб вона відкривала більше букв!</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-openLastLetters.jpg"
                  alt="Штопор">
              </div>
              <div class="desc-list-screen-info">Штопор</div>
            </div>
            <div class="desc-list-info">Ця підказка відкриває останні букви! Радимо вам економити підказки, так як гра постійно ускладнюється. І, повірте, підказок буде не вистачати...</div>
          </li>
          <li>
            <div class="desc-list-screen">
              <div class="desc-list-screen-icon">
                <img
                  src="/static/img/screen-bomb.jpg"
                  alt="Бомба">
              </div>
              <div class="desc-list-screen-info">Бомба</div>
            </div>
            <div class="desc-list-info">Ця підказка відкриває випадкові літери! Врахуйте, в бонусних рівнях, на жаль, підказками користуватися не буде можливості. Але на те вони і бонусні (особоскладні)!</div>
          </li>
        </ul>
        <hr>
        <p>Для того, щоб налаштувати гру під себе, натисніть на свій профіль, поруч з яким розташована шестерня. Ви потрапите на цю сторінку:</p>
        <p>
          <img
            src="/static/img/screen-settings.jpg"
            class="screen"
            alt="Кабінет">
        </p>
        <p>Натиснувши на вкладку "Інфо" ви потрапите на сторінку зі статистикою вашого профілю:</p>
        <p>
          <img
            src="/static/img/screen-info.jpg"
            class="screen"
            alt="Профіль">
        </p>
        <p>Також, після деяких дій, ви можете отримати нагороди! Перейдіть на вкладку "Досягнення", щоб подивитися їх:</p>
        <p>
          <img
            src="/static/img/screen-awards.jpg"
            class="screen"
            alt="Досягнення">
        </p>
        <p>Врахуйте, що у досягнень відкриті тільки назви. А ось як їх отримати - доведеться подумати або закликати на допомога власну удачу.</p>
        <p>Магазин виглядає так:</p>
        <p>
          <img
            src="/static/img/screen-shop.jpg"
            class="screen"
            alt="Магазин">
        </p>
        <p>Зайти в нього можна або зі сторінки свого профілю, або зі сторінки гри.</p>
        <p>У магазині ви можете як купити підказки, так і "прокачати" їх.</p>
        <p>
          <img
            src="/static/img/screen-shop-levelUp.jpg"
            class="screen"
            alt="Магазин">
        </p>
        <p>Бажаємо вам вдалої і веселої гри!</p>
        <p>З усіх питань і побажань можете написати нам на пошту:
          <a
            href="mailto:imhvost@gmail.com"
            target="_blank">imhvost@gmail.com</a>
        </p>
        <p>
          <router-link
            exact
            tag="a"
            to="/privacy-policy"
            @click.native="$root.playAudio('click')">
            <span>Політика конфіденційності</span>
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import BackBtn from '../components/BackBtn.vue'

export default {
  components: {
    BackBtn
  },
  computed: {
    lang () {
      return this.$store.state.settings.lang
    }
  },
  methods: {
    //
  }
}

</script>

<style lang="less" scoped>
@import (less) '../less/variables.less';
.promo{
  font-family:@f;
  font-weight:700;
}
.content-text{
  &>*:not(:last-child){
    margin-bottom:1.4286rem;
  }
  img{
    border:solid 1px #ccc;
  }
  a{
    text-decoration:underline;
    &:hover{
      text-decoration:none;
    }
  }
}
.screen{
  display:block;
  width:20.7143rem;
  margin:auto;
}
.desc-list{
  li{
    margin-top:1rem;
    padding-top:1rem;
    border-top:solid 1px @border;
  }
}
.desc-list-screen{
  display:flex;
  align-items:center;
}
.desc-list-screen-icon{
  max-width:8.2143rem;
  margin-right:0.7143rem;
}
.desc-list-screen-icon-big{
  max-width:23.5714rem;
}
.desc-list-screen-info{
  font-weight:700;
}
.desc-list-info{
  margin-top:0.7143rem;
}
</style>
