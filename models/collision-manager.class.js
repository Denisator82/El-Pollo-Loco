/**
 * CollisionManager handles all collision detection and related logic.
 * It interacts with the World instance and its objects (character, enemies, items).
 */
class CollisionManager {
  constructor(world) {
    this.world = world;
  }

  checkAllCollisions() {
    this.checkCollisionsCharacterWithEndboss();
    this.checkCollisionsCharacterWithCoins();
    this.checkCollisionsCharacterWithBottles();
    this.checkCollisionsCharacterJumpOnEnemy();
    this.checkCollisionsCharacterWithEnemies();
    this.checkCollisionsThrowableObjectsWithEnemies();
  }

  applyDamageToCharacterAndShowUpdate(dmg) {
    this.world.character.hit(dmg);
    this.world.statusBar?.setPercentage?.(this.world.character.energy);
  }

  checkCollisionsCharacterWithEndboss() {
    const boss = this.world.level.enemies.find(e => e instanceof Endboss);
    if (!boss) return;

    if (this.isEndbossCollisionActive(boss)) {
      this.handleCharacterEndbossHit(boss);
      this.handleEndbossCharacterCollisionStart(boss);
    } else {
      this.handleEndbossCharacterCollisionEnd(boss);
    }
  }

  isEndbossCollisionActive(boss) {
    return boss?.isDeadEndboss?.() === false &&
      !this.world.gameOver &&
      !this.world.character.isHurt?.() &&
      this.world.character.isColliding?.(boss);
  }

  handleCharacterEndbossHit(boss) {
    this.applyDamageToCharacterAndShowUpdate(boss.damage);
    if (this.world.character.isDead()) this.triggerGameOverLose();
  }

  handleEndbossCharacterCollisionStart(boss) {
    boss.handleCharacterCollision?.();

    const shouldAttack = !boss.isDeadEndboss?.() &&
      !boss.isAttacking &&
      Date.now() - boss.lastAttackTime > boss.attackCooldown;

    if (shouldAttack) {
      boss.isAttacking = true;
      boss.lastAttackTime = Date.now();
      boss.playAnimationOnce?.(boss.IMAGES_ATTACK, () => {
        boss.isAttacking = false;
        boss.handleCharacterCollisionEnd?.();
      });
    }
  }

  handleEndbossCharacterCollisionEnd(boss) {
    if (boss.isCollidingWithCharacter) {
      boss.handleCharacterCollisionEnd?.();
    }
  }

  checkCollisionsCharacterWithEnemies() {
    this.world.level.enemies.forEach(e => {
      if (!(e instanceof Endboss)) this.checkCollisionWithNormalEnemy(e);
    });
  }

  checkCollisionWithNormalEnemy(enemy) {
    if (this.isEnemyCollisionActive(enemy)) {
      this.handleCharacterEnemyHit(enemy);
    }
  }

  isEnemyCollisionActive(enemy) {
    return enemy?.isDead?.() === false &&
      !this.world.gameOver &&
      !this.world.character.isHurt?.() &&
      this.world.character.isColliding?.(enemy);
  }

  handleCharacterEnemyHit(enemy) {
    const dmg = typeof enemy.damage === 'number' ? enemy.damage : 5;
    this.applyDamageToCharacterAndShowUpdate(dmg);
    if (this.world.character.isDead()) this.triggerGameOverLose();
  }

  checkCollisionsCharacterJumpOnEnemy() {
    for (let i = this.world.level.enemies.length - 1; i >= 0; i--) {
      const e = this.world.level.enemies[i];
      if (
        e?.isDead?.() === false &&
        this.world.character.isColliding?.(e) &&
        this.world.character.isJumpingOn?.(e)
      ) {
        this.handleEnemyDefeatedByJump(e);
      }
    }
  }

  handleEnemyDefeatedByJump(enemy) {
    this.world.character.speedY = 5;
    enemy.setDead?.();
    this.scheduleEnemyRemoval(enemy);
    this.world.audioManager?.playSound?.('chickenDead');
  }

  scheduleEnemyRemoval(enemy) {
    setTimeout(() => {
      const i = this.world.level.enemies.indexOf(enemy);
      if (i > -1) this.world.level.enemies.splice(i, 1);
    }, 500);
  }

  checkCollisionsCharacterWithCoins() {
    for (let i = this.world.level.coins.length - 1; i >= 0; i--) {
      const coin = this.world.level.coins[i];
      if (this.world.character.isColliding?.(coin)) {
        this.world.character.collectCoin?.(coin);
        this.world.level.coins.splice(i, 1);
      }
    }
  }

  checkCollisionsCharacterWithBottles() {
    for (let i = this.world.level.bottles.length - 1; i >= 0; i--) {
      const bottle = this.world.level.bottles[i];
      if (this.world.character.isColliding?.(bottle)) {
        this.world.character.collectBottle?.(bottle);
        this.world.level.bottles.splice(i, 1);
      }
    }
  }

  checkCollisionsThrowableObjectsWithEnemies() {
    this.world.throwableObjects.forEach(bottle => {
      if (!bottle.isSplashed) {
        for (let i = this.world.level.enemies.length - 1; i >= 0; i--) {
          const enemy = this.world.level.enemies[i];
          if (enemy.isColliding?.(bottle)) {
            this.handleBottleHitsEnemy(bottle, enemy);
            break;
          }
        }
      }
    });
  }

  handleBottleHitsEnemy(bottle, enemy) {
    enemy instanceof Endboss
      ? this.handleBottleHitsEndboss(bottle, enemy)
      : this.handleBottleHitsNormalEnemy(bottle, enemy);

    this.handleBottleSplatAndRemoval(bottle);
  }

  handleBottleHitsEndboss(bottle, boss) {
    const dmg = typeof bottle.damage === 'number' ? bottle.damage : 20;
    boss.hitEndboss?.(dmg);
  }

  handleBottleHitsNormalEnemy(bottle, enemy) {
    enemy.setDead?.();
    this.world.audioManager?.playSound?.('chickenDead');
    this.scheduleEnemyRemoval(enemy);
  }

  handleBottleSplatAndRemoval(bottle) {
    if (bottle.onTargetHit) {
      bottle.onTargetHit();
    } else {
      bottle.isSplashing = true;
      this.world.audioManager?.playSound?.('bottle_hit');
    }
  }

  triggerGameOverLose() {
    if (this.world.gameOver) return;
    this.world.gameOver = true;
    this.world.gameLose?.() || gameLose?.();
  }

  triggerGameWin() {
    this.world.gameOver = true;
    this.world.gameWin?.() || gameWin?.();
  }
}
